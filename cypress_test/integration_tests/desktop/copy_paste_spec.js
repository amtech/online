/* global describe it cy beforeEach require expect afterEach*/

var helper = require('../common/helper');

describe('Clipboard operations.', function() {
	beforeEach(function() {
		helper.loadTestDoc('simple.odt');
	});

	afterEach(function() {
		helper.afterAll();
	});

	it('Copy and Paste text.', function() {
		// Select some text
		cy.get('#document-container').dblclick();
		cy.get('.leaflet-marker-icon')
			.should('exist');

		cy.get('.leaflet-marker-icon')
			.then(function(marker) {
				expect(marker).to.have.lengthOf(2);
				var XPos =  (marker[0].getBoundingClientRect().right + marker[1].getBoundingClientRect().left) / 2;
				var YPos = marker[0].getBoundingClientRect().top;
				cy.wait(200);
				cy.get('body').rightclick(XPos, YPos);
			});

		cy.get('.context-menu-list').should('be.visible')
			.get('.context-menu-item .context-menu-link')
			.contains('Copy')
			.click();

		// Loleaflet code can not execute document.execCommand() when executed by cypress
		// https://github.com/cypress-io/cypress/issues/2851
		cy.get('.vex-dialog-message p')
			.contains('Your browser has very limited access to the clipboard, so use these keyboard shortcuts:');
	});
});
