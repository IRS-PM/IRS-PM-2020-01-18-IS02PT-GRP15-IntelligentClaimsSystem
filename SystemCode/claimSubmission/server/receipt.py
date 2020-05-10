
# !/usr/bin/python3
# coding: utf-8

# Copyright 2015-2018
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import dateutil.parser
import re
from difflib import get_close_matches, SequenceMatcher

# from parser.objectview import ObjectView

class Receipt(object):
    """ company receipt to be parsed """

    def __init__(self, config, raw):
        """
        :param config: ObjectView
            Config object
        :param raw: [] of str
            Lines in file
        """

        self.config = config
        self.company = self.date = self.sum = self.billno = None
        self.lines = raw.split('\n')
        self.normalize()
        self.parse()

    def normalize(self):
        """
        :return: void
            1) strip empty lines
            2) convert to lowercase
            3) encoding?

        """

        self.lines = [
            line.lower() for line in self.lines if line.strip()
        ]

    def parse(self):
        """
        :return: void
            Parses obj data
        """

        self.company = self.parse_company()
        self.billno = self.parse_billno()
        self.date = self.parse_date()
        self.sum = self.parse_sum()


    def combine_words(self, words, min=1, max=3):
        for start in range(0, len(words)-1):
            for end in range(start+1, len(words)):
                if min <= end-start <= max:
                    yield ' '.join(words[start:end])


    def fuzzy_find(self, keyword, accuracy=0.6, token_re='(.+)'):
        """
        :param keyword: str
            The keyword string to look for
        :param accuracy: float
            Required accuracy for a match of a string with the keyword
        :return: str
            Returns the first line in lines that contains a keyword.
            It runs a fuzzy match if 0 < accuracy < 1.0
        """
        matches = []
        next_line = False
        #max_distance = accuracy * len(keyword)
        for line in self.lines:
            ratio = SequenceMatcher(None, line, keyword).ratio()
            if next_line:
                return line
            elif ratio >= 0.9:
                next_line = True
                continue
            elif ratio <= 0.01:
                continue
            elif ratio >= accuracy:
                return line
            elif len(keyword.split()) > 1 and ratio > 0:      
                words = sorted(self.combine_words(line.split()))
                #print ([w for w in words])
            else:
                words = line.split()
            # Get the single best match in line

            matches = get_close_matches(keyword, words, 1, accuracy)
            if matches:
                #get the text after matched text
                return line

    def fuzzy_find_next(self, keyword, accuracy=0.6):
        """
        :param keyword: str
            The keyword string to look for
        :param accuracy: float
            Required accuracy for a match of a string with the keyword
        :return: str
            Returns the first line in lines that contains a keyword.
            It runs a fuzzy match if 0 < accuracy < 1.0
        """
        matches = []
        next_line = False
        for line in self.lines:
            ratio = SequenceMatcher(None, line, keyword).ratio()
            if next_line:
                return line
            elif ratio == 0.9:
                next_line = True
                continue
            elif ratio >= accuracy and ratio < 0.9:
                return line
            elif len(keyword.split()) > 1 and ratio > 0.3:      
                words = sorted(self.combine_words(line.split()))
                #print ([w for w in words])
            else:
                words = line.split()
            # Get the single best match in line

            matches = get_close_matches(keyword, words, 1, accuracy)
            if matches:
                return line

    def parse_date(self):
        """
        :return: date
            Parses data
        """

        for line in self.lines:
            m = re.match(self.config.date_format, line)
            if m:  # We"re happy with the first match for now
                # validate date using the dateutil library (https://dateutil.readthedocs.io/)
                date_str = m.group(1)
                try:
                    date_str = date_str.replace('.','-').replace('/','-')
                    return dateutil.parser.parse(date_str, dayfirst=True).isoformat()
                    #return date_str
                except ValueError as err:
                    print("Error parsing %s: %s",date_str, err)
                    return None


    def parse_company(self):
        """
        :return: str
            Parses company data
        """

        for int_accuracy in range(10, 6, -1):
            accuracy = int_accuracy / 10.0

            for company, spellings in self.config.companies.items():
                for spelling in spellings:
                    line = self.fuzzy_find(spelling, accuracy)
                    if line:
                        print(line, accuracy, company)
                        return company
        return self.lines[0]

    def parse_sum(self):
        """
        :return: str
            Parses sum data
        """

        for sum_key in self.config.sum_keys:
            sum_line = self.fuzzy_find(sum_key, 0.8)
            if sum_line:
                #print("sum_line: %s", sum_line)
                sum_line = sum_line.replace(",", "")
                sum_float = re.findall(self.config.sum_format, sum_line)
                if sum_float:
                    return sum_float[-1]
            #2nd option to find next line
            else:
                sum_line = self.fuzzy_find_next(sum_key, 0.8)
            if sum_line:
                #print("sum_line: %s", sum_line)
                sum_line = sum_line.replace(",", "")
                # Parse the sum
                sum_float = re.findall(self.config.sum_format, sum_line)
                if sum_float:
                    return sum_float[-1]

    def parse_billno(self):
        """
        :return: str
            Parses sum data
        """
        for int_accuracy in range(10, 8, -1):
            accuracy = int_accuracy / 10.0

            for key in self.config.billno:
                line = self.fuzzy_find(key, accuracy)
                if line:
                    bill_no = re.search(self.config.ref_format, line)
                    if bill_no:
                        return bill_no.group(0)                    
