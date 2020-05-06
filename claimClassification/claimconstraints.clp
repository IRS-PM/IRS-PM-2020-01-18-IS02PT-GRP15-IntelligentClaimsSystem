(deftemplate Claims
	(slot claimtotal (type NUMBER))
	(multislot occurance_date (type NUMBER))
)

(deftemplate Doctors
        (slot black_list (type SYMBOL)(allowed-symbols N Y))
)

(deftemplate Policy
	(multislot policy_exp (type NUMBER))
	(slot rider (type SYMBOL)(allowed-symbols N Y))
	(slot policyduration)
	(slot policy_balance (type NUMBER))
	(slot auto_allowed (type SYMBOL)(allowed-symbols Y N))
)

(deftemplate Hospital
	(slot type (type SYMBOL)(allowed-symbols C V S G))
)


(deftemplate Diagnosis
	(slot diagnosis_code)
	(slot autoreject (type SYMBOL)(allowed-symbols N Y))
)

(deftemplate Claimproducts
	(slot pcode)
	(slot amount)
	(slot limit)
)


(deftemplate Insured
	(slot outstanding (type NUMBER))
	(slot claimsnum_total (type NUMBER))
	(slot autonum (type NUMBER))
	(multislot pre_illness)
)

(deftemplate Rider
	(multislot start_date (type NUMBER))
	(slot outstanding (type NUMBER))
)

(defrule riderconstraints
    (declare (salience 30))
	(Claims(occurance_date ?odd ?omm ?oyy))
	(Rider(start_date ?rdd ?rmm ?ryy))
=>
	(if(eq ?ryy ?oyy)
	  then(if(eq ?rmm ?omm)
		then(if(> ?rdd ?odd)
		     then(assert(rider no)))
	        else(if(> ?rmm ?omm)
		    then(assert(rider no))
		    )
	       )
	  else(if(> ?ryy ?oyy)
	       then(assert(rider no)))
	 )
)

(defrule rider
(Policy(rider Y))
(not(Rider(outstanding 0)))
=>
(assert(autoclaim no))
(assert(reason outstanding_rider)))


; doctor in blacklist
(defrule dconstraint
     (Doctors(black_list Y))
=>
(assert(autoclaim no))
(assert(reason doctor_in_blist)))


;Policy auto allowed
(defrule autoallowed
    (Policy(auto_allowed ~Y))
=>(assert(autoclaim no))
(assert(reason not_autoallowed)))

;determining rider benefit
(defrule benefit
    (declare (salience 20))
    (Policy(rider Y))
    (not(rider no))
    ?old <- (Claims(claimtotal ?t))
    (test (> ?t 1500))
=>
(modify ?old (claimtotal (- ?t 1500))))



;diagnosis code in the not_allowed_diagnosis_codes
(defrule diagnosisallowed
	(Diagnosis(diagnosis_code ~None)
	(autoreject Y))
=>(assert(autoclaim no))
(assert(reason diagnosiscode_not_allowed)))


;diagnosiscode not available for hospitalization claims
;(defrule codeconstraint
;	(Claims(billcategory ?bc &IN|DY))
;	(Diagnosis(diagnosis_code None))
;=>(assert(autoclaim no)))


;product limit check
(defrule Plimitcheck
	(Claimproducts(pcode ?p)(amount ?a)(limit ?l))
	(test (> ?a ?l))
=>
(assert(autoclaim no))
(assert(reason amount_exceeds_limit)))


; date of occurance check with policy expiry date
(defrule dateconstraints
	(Claims(occurance_date ?odd ?omm ?oyy))
	(Policy(policy_exp ?pdd ?pmm ?pyy))
=>
	(if(eq ?pyy ?oyy)
	  then(if(eq ?pmm ?omm)
		then(if(> ?odd ?pdd)
		     then(assert(autoclaim no))
		         (assert(reason policy_expired)))
	        else(if(> ?omm ?pmm)
		    then(assert(autoclaim no))
		        (assert(reason policy_expired)))
		    )
	       )
	  else(if(> ?oyy ?pyy)
	       then(assert(autoclaim no))
	           (assert(reason policy_expired))
	 )
)

;policy duration
(defrule durationconstraint
	(Policy(policyduration ?pd))
	(test (< ?pd 12))
=>
(assert(autoclaim no))
(assert(reason policy_new)))


; policy balance less than claim amount
(defrule amountconstraint
	(Policy(policy_balance ?pb))
	(Claims(claimtotal ?ca))
	(test(< ?pb ?ca))
=>
(assert(autoclaim no))
(assert(reason amount_exceeds_balance)))



; private hospital limit 6000
(defrule pHospitalconstraint
	(Hospital(type V))
	(Claims(claimtotal ?amt))
	(test(> ?amt 6000))
=>
(assert(autoclaim no))
(assert(reason amount_exceeds_for_hospital_type)))


; restructured hospital limit
(defrule rHospitalconstraint
	(Hospital(type ~V))
	(Claims(claimtotal ?amt))
	(test(> ?amt 4000))
=>
(assert(autoclaim no))
(assert(reason amount_exceeds_for_hospital_type)))


;Checking Insured's past
(defrule goodpast 
	(Insured(claimsnum_total ?ct)(autonum ?pa)(outstanding 0))
	(not(Insured(pre_illness ?)))
	(test (>= ?ct 1))
	(test (<= ?pa 5))
=>(assert(past good)))


;pastillness check
(defrule preillness
(declare (salience 30))
(Insured(pre_illness ?))
=>(assert(reason pre-existing_illness)))

;checking for first claim
(defrule first_claim
(declare (salience 30))
(Insured(claimsnum_total ?ct))
(test (= ?ct 0))
=>(assert(reason first_claim)))

;checking outstanding premium
(defrule premium
(declare (salience 30))
(Insured(outstanding ~0))
=>(assert(reason outstanding_premium)))

;checking autoclaim limit
(defrule autolimit
(declare (salience 30))
(Insured(autonum ?pa))
(test (> ?pa 5))
=>(assert(reason autoclaim_limit_reached)))


; if any of the constraints doesn't match
(defrule manualsettle
	(autoclaim no)
=>
(assert(classification manual)))

