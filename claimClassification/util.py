from datetime import date, datetime
from dateutil.relativedelta import relativedelta


def getduration(startdate):
    sdate = datetime.strptime(startdate, '%d %m %y')
    currentdate = date.today()
    rdelta = relativedelta(currentdate, sdate)
    years = rdelta.years
    months = rdelta.months
    if years >= 1:
        months = months + (years * 12)
    return months

def getClaimtotalnum(data):
    return len(data)

def getdifference(date1, date2):
    newdate = datetime.strptime(date1, '%d %m %y')
    maindate = datetime.strptime(date2, '%d %m %y')
    diff = newdate - maindate
    return diff.days