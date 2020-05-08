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
	(slot status (type NUMBER))
	(slot policyduration)
	(slot policy_balance (type NUMBER))
	(slot auto_allowed (type SYMBOL)(allowed-symbols Y N))
)

(deftemplate Hospital
	(slot type (type SYMBOL)(allowed-symbols C V S G))
)

(deftemplate Status
    (slot pending (type NUMBER))
    (slot rejected (type NUMBER))
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

;checking past claims status
(defrule status
(Status(pending ?p)(rejected ?r))
(test (>= ?p 1))
(test (>= ?r 1))
=>
(assert(reason Pending_or_Rejected_claims))
(assert(autoclaim no)))


;checking rider outstanding
(defrule rider
(Policy(rider Y))
(not(Rider(outstanding 0)))
=>
(assert(reason outstanding_rider))
(assert(autoclaim no)))


;checking claimamount limit
(defrule claimamount
(Claims(claimtotal ?c))
(test (> ?c 20000))
=>
(assert(reason claim_amount_exceeds_autoclaim_limit))
(assert(autoclaim no)))


;checking policy validity
(defrule policyvalidity
(Policy(status ~1))
=>
(assert(reason policy_not_inforce))
(assert(autoclaim no)))


; doctor in blacklist
(defrule dconstraint
     (Doctors(black_list Y))
=>
(assert(reason doctor_in_blist))
(assert(autoclaim no)))


;Policy auto allowed
(defrule autoallowed
    (Policy(auto_allowed ~Y))
=>
(assert(reason not_autoallowed))
(assert(autoclaim no)))


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
=>
(assert(reason diagnosiscode_not_allowed))
(assert(autoclaim no)))



;product limit check
(defrule Plimitcheck
	(Claimproducts(pcode ?p)(amount ?a)(limit ?l))
	(test (> ?a ?l))
=>
(assert(reason amount_exceeds_limit))
(assert(autoclaim no)))



; date of occurance check with policy expiry date
(defrule dateconstraints
	(Claims(occurance_date ?odd ?omm ?oyy))
	(Policy(policy_exp ?pdd ?pmm ?pyy))
=>
	(if(eq ?pyy ?oyy)
	  then(if(eq ?pmm ?omm)
		then(if(> ?odd ?pdd)
		     then(assert(reason policy_expired))
		          (assert(autoclaim no))
		         )
	        else(if(> ?omm ?pmm)
		    then(assert(reason policy_expired))
		         (assert(autoclaim no))
		        )
		    )
	 )
	  else(if(> ?oyy ?pyy)
	       then(assert(reason policy_expired))
	           (assert(autoclaim no))

	 )
)

;policy duration
(defrule durationconstraint
	(Policy(policyduration ?pd))
	(test (< ?pd 12))
=>
(assert(reason policy_new))
(assert(autoclaim no)))



; policy balance less than claim amount
(defrule amountconstraint
	(Policy(policy_balance ?pb))
	(Claims(claimtotal ?ca))
	(test(< ?pb ?ca))
=>
(assert(reason amount_exceeds_balance))
(assert(autoclaim no)))




; private hospital limit 6000
(defrule pHospitalconstraint
	(Hospital(type V))
	(Claims(claimtotal ?amt))
	(test(> ?amt 6000))
=>
(assert(reason amount_exceeds_for_hospital_type))
(assert(autoclaim no)))



; restructured hospital limit
(defrule rHospitalconstraint
	(Hospital(type ~V))
	(Claims(claimtotal ?amt))
	(test(> ?amt 4000))
=>
(assert(reason amount_exceeds_for_hospital_type))
(assert(autoclaim no)))



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

