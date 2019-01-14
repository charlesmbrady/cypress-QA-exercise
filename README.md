# cypress-QA-exercise
TEST PLAN
NOTE: the testfile is "cypress-QA-exercise/cypress/integration/calc-spec.js"

- Make sure calculator is visible

- Check to see if default values are displayed

- Make sure clickables work (“infoboxes and dropdown pick lists”)
    - As you click their corresponding buttons, they should toggle between visible or hidden


- Make sure intervals for “Loan Amount” work as expected
    - 0-999 = invalid values, nothing happens 
    - > 100,000 = invalid values,  nothing happens
    - Special characters = invalid
    - 1000 - 100,000 = VALID
    

- Make sure intervals for “Interest Rate” work as expected

    - 0.001 < interest rate < 99  = Valid values, others are invalid and nothing happens

    - Special characters = invalid
        - Error should be displayed here


- Make sure the values displayed on the right are correctly displayed based on the Loan Amount, Length, and Interest Rate

    - Check these based on a few of the valid input values (extremes, and one in the middle)


Bugs:
98.9 is supposed to be a valid Interest Rate value, but sometimes it is not...

to reproduce:
1. type 100000 in the Interest Rate box, hit enter
2. type 98.9 in the interest Rate box, hit enter (it is valid)
3. repeat steps 1 and 2, but notice 98.9 is said to be invalid
4. repeat steps 1 and 2 again, but notice 98.9 is VALID again!
