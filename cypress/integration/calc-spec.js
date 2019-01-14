/// <reference types="Cypress" />

context('Auto-loan Calculator', () => {

    beforeEach(() => {
        cy.visit("https://www.bankrate.com/calculators/auto/auto-loan-calculator.aspx")
    })
    //visit the page first

    //run tests
    //make sure calculator is visible
    it('calculator is visible', () => {
        cy.get('.calculator__container').should('be.visible')
    })

    //check defaults
    it('check default text', () => {
        //calculator section
        cy.get('.calculator__gray-bg > :nth-child(1) > .br-amount > .form-label > :nth-child(1)')
        .should('contain','How much are you looking to borrow?')

        cy.get('.calculator__gray-bg > :nth-child(2) > .dropdown > .dropdown__selected')
        .should('contain','60 months')

        cy.get(':nth-child(2) > .dropdown > .form-label > :nth-child(1)')
        .should('contain','For how long?')

        cy.get(':nth-child(3) > .dropdown > .dropdown__selected')
        .should('contain','Used')

        cy.get(':nth-child(3) > .dropdown > .form-label > div')
        .should('contain','Is your vehicle new or used?')

        cy.get('.size-3of4 > :nth-child(1) > .br-amount > .form-label > div')
        .should('contain', 'Interest rate')

        cy.get('.size-5of8 > .dropdown > .dropdown__selected')
        .should('contain', 'Find a rate')
        

        cy.get('.calculator__results-section > :nth-child(1)')
        .should('contain', 'Your estimated monthly payment')
        .should('contain', 'Total Principal Paid')
        .should('contain','Total Interest Paid')
    })

    //check that info boxes work
    it('info boxes work', () => {
        //first info box
        cy.get('.br-amount > .form-label > :nth-child(1) > .tool-tip').click()
        cy.get('.br-amount > .form-label > :nth-child(1) > .tool-tip > .tool-tip__box')
        .should('be.visible')

        cy.get('.br-amount > .form-label > :nth-child(1) > .tool-tip').click()
        cy.get('.br-amount > .form-label > :nth-child(1) > .tool-tip > .tool-tip__box')
        .should('not.be.visible')
        
        //second info box
        cy.get('.dropdown > .form-label > :nth-child(1) > .tool-tip').click()
        cy.get('.dropdown > .form-label > :nth-child(1) > .tool-tip > .tool-tip__box')
        .should('be.visible')

        cy.get('.dropdown > .form-label > :nth-child(1) > .tool-tip').click()
        cy.get('.dropdown > .form-label > :nth-child(1) > .tool-tip > .tool-tip__box')
        .should('not.be.visible')
    })

    //check to see if dropdown picklists work
    it('dropdown picklists work', () => {
        //'for how long' dropdown arrow
        cy.get('.calculator__gray-bg > :nth-child(2) > .dropdown > .dropdown__selected > .dropdown__arrow')
        .click()
        //picklist should be visible
        cy.get(':nth-child(2) > .dropdown > .dropdown__list-wrapper')
        .should('be.visible')
        //click a value, the picklist should hide, and the original value shown should change
        cy.get(':nth-child(2) > .dropdown > .dropdown__list-wrapper > .dropdown__list-container > .list-bare > :nth-child(2)')
        .click()
        cy.get(':nth-child(2) > .dropdown > .dropdown__list-wrapper')
        .should('not.be.visible')
        cy.get('.calculator__gray-bg > :nth-child(2) > .dropdown > .dropdown__selected')
        .should('contain','48 months')

        //'new or used' dropdown arrow
        cy.get(':nth-child(3) > .dropdown > .dropdown__selected > .dropdown__arrow')
        .click()
        //picklist should be visible
        cy.get(':nth-child(3) > .dropdown > .dropdown__list-wrapper')
        .should('be.visible')
        //click 'new', pickclist should hide, original value should change
        cy.get(':nth-child(3) > .dropdown > .dropdown__list-wrapper > .dropdown__list-container > .list-bare > :nth-child(1)')
        .click()
        cy.get(':nth-child(3) > .dropdown > .dropdown__list-wrapper')
        .should('not.be.visible')
        cy.get(':nth-child(3) > .dropdown > .dropdown__selected')
        .should('contain','New')

        //'find a rate' dropdown
        cy.get('.size-5of8 > .dropdown > .dropdown__selected > .dropdown__arrow')
        .click()
        cy.get('.find-rate__dropdown-wrapper > .dropdown__list-container > .list-bare')
        .should('be.visible')
        cy.get('.find-rate__dropdown-wrapper > .dropdown__list-container > .list-bare')
        .click()
        cy.get('.find-rate__dropdown-wrapper > .dropdown__list-container > .list-bare')
        .should('not.be.visible')
    })

    //make sure invalid values and special characters don't work
    it('number values invalids dont work', () => {
        //type loan amount of 0, nothing should change on the right
        cy.get('[data-cy=amount]').type('0').type('{enter}')
        cy.get('.numeral').should('contain','270')
        cy.get('.calculator__results-section > :nth-child(1) > :nth-child(3)').should('contain','15,000')
        cy.get('.calculator__results-section > :nth-child(1) > :nth-child(4)').should('contain','1,172')

        //type loan amount to 100,001, nothing should change on the right
        cy.get('[data-cy=amount]').clear().type('100,001').type('{enter}')
        cy.get('.numeral').should('contain','270')
        cy.get('.calculator__results-section > :nth-child(1) > :nth-child(3)').should('contain','15,000')
        cy.get('.calculator__results-section > :nth-child(1) > :nth-child(4)').should('contain','1,172')

        //type interest rate 0, see "invalid rate" show up
       cy.get('[name="interest-rate"]').clear().type('0').type('{enter}')
        cy.get('.error-message').should('be.visible')

        //type interest rate of 99, see"invalid rate" show up
       cy.get('[name="interest-rate"]').clear().type('99').type('{enter}')
        cy.get('.error-message').should('be.visible')
        
        //type loan amount of 999, nothing should change on the right
        cy.get('[data-cy=amount]').clear().type('999').blur()
        cy.get('.numeral').should('contain','270')

        //check special characters
        cy.get('[data-cy=amount]').type('!').type('{enter}')
        cy.get('.numeral').should('contain','270')
        cy.get('.calculator__results-section > :nth-child(1) > :nth-child(3)').should('contain','15,000')
        cy.get('.calculator__results-section > :nth-child(1) > :nth-child(4)').should('contain','1,172')

        cy.get('[name="interest-rate"]').clear().type('@').type('{enter}')
        cy.get('.error-message').should('be.visible')

    })

    it('number values are accurate', () => {
        //type loan amount of 1000, see changes
        cy.get('[data-cy=amount]').clear().type('1000').blur()
        cy.get('[name="interest-rate"]').focus().type('1').type('{enter}')
        cy.get('.numeral').should('contain','17')
        cy.get('.calculator__results-section > :nth-child(1) > :nth-child(3)').should('contain','1,000')
        cy.get('.calculator__results-section > :nth-child(1) > :nth-child(4)').should('contain','26')

        //try interest rate of 98
        cy.get('[name="interest-rate"]').focus().type('98').type('{enter}')
        cy.get('.numeral').should('contain','82')
        cy.get('.calculator__results-section > :nth-child(1) > :nth-child(3)').should('contain','1,000')
        cy.get('.calculator__results-section > :nth-child(1) > :nth-child(4)').should('contain','3,945')

        //interest rate of 11.5
        cy.get('[name="interest-rate"]').focus().type('11.5').type('{enter}')
        cy.get('.numeral').should('contain','22')
        cy.get('.calculator__results-section > :nth-child(1) > :nth-child(3)').should('contain','1,000')
        cy.get('.calculator__results-section > :nth-child(1) > :nth-child(4)').should('contain','320')
        
        //interest rate of 0.1
        cy.get('[name="interest-rate"]').focus().type('0.1').type('{enter}')
        cy.get('.numeral').should('contain','17')
        cy.get('.calculator__results-section > :nth-child(1) > :nth-child(3)').should('contain','1,000')
        cy.get('.calculator__results-section > :nth-child(1) > :nth-child(4)').should('contain','3')


        //type loan amount of 100,000, see changes******************************
        cy.get('[data-cy=amount]').clear().type('100000').blur()
       cy.get('[name="interest-rate"]').focus().type('1').type('{enter}')
        cy.get('.numeral').should('contain','1709')
        cy.get('.calculator__results-section > :nth-child(1) > :nth-child(3)').should('contain','100,000')
        cy.get('.calculator__results-section > :nth-child(1) > :nth-child(4)').should('contain','2,562')
        //try interest rate of 98
       cy.get('[name="interest-rate"]').focus().type('98').type('{enter}')
        cy.get('.numeral').should('contain','8241')
        cy.get('.calculator__results-section > :nth-child(1) > :nth-child(3)').should('contain','100,000')
        cy.get('.calculator__results-section > :nth-child(1) > :nth-child(4)').should('contain','394,452')

        //interest rate of 11.5
       cy.get('[name="interest-rate"]').focus().type('11.5').type('{enter}')
        cy.get('.numeral').should('contain','2199')
        cy.get('.calculator__results-section > :nth-child(1) > :nth-child(3)').should('contain','100,000')
        cy.get('.calculator__results-section > :nth-child(1) > :nth-child(4)').should('contain','31,956')
        
        //interest rate of 0.1
       cy.get('[name="interest-rate"]').focus().type('0.1').type('{enter}')
        cy.get('.numeral').should('contain','1671')
        cy.get('.calculator__results-section > :nth-child(1) > :nth-child(3)').should('contain','100,000')
        cy.get('.calculator__results-section > :nth-child(1) > :nth-child(4)').should('contain','254')


        //try changing the length values
        //48 months
        cy.get('.calculator__gray-bg > :nth-child(2) > .dropdown > .dropdown__selected > .dropdown__arrow')
        .click()
        cy.get(':nth-child(2) > .dropdown > .dropdown__list-wrapper > .dropdown__list-container > .list-bare > :nth-child(2)')
        .click()
        cy.get('.numeral').should('contain','2088')
        cy.get('.calculator__results-section > :nth-child(1) > :nth-child(3)').should('contain','100,000')
        cy.get('.calculator__results-section > :nth-child(1) > :nth-child(4)').should('contain','204')

        //36 months
        cy.get('.calculator__gray-bg > :nth-child(2) > .dropdown > .dropdown__selected > .dropdown__arrow')
        .click()
        cy.get(':nth-child(2) > .dropdown > .dropdown__list-wrapper > .dropdown__list-container > .list-bare > :nth-child(1)')
        .click()
        cy.get('.numeral').should('contain','2782')
        cy.get('.calculator__results-section > :nth-child(1) > :nth-child(3)').should('contain','100,000')
        cy.get('.calculator__results-section > :nth-child(1) > :nth-child(4)').should('contain','154')

        

    })

    
})