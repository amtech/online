if ENABLE_CYPRESS
CYPRESS_BINARY = ${abs_srcdir}/node_modules/cypress/bin/cypress

DESKTOP_USER_AGENT = "cypress"
DESKTOP_TEST_FOLDER = integration_tests/desktop
DESKTOP_DATA_FOLDER = ${abs_srcdir}/data/desktop/
DESKTOP_WORKDIR = ${abs_srcdir}/workdir/desktop/

MOBILE_USER_AGENT = "cypress mobile"
MOBILE_TEST_FOLDER = integration_tests/mobile
MOBILE_DATA_FOLDER = ${abs_srcdir}/data/mobile/
MOBILE_WORKDIR = ${abs_srcdir}/workdir/mobile/

if HAVE_LO_PATH
check-local: @JAILS_PATH@ node_modules
	$(call run_JS_error_check)
	$(call start_loolwsd)
	$(call run_desktop_tests)
	$(call run_mobile_tests)
	@pkill loolwsd || true

check-desktop: @JAILS_PATH@ node_modules
	$(call run_JS_error_check)
	$(call start_loolwsd)
	$(call run_desktop_tests,$(spec))
	@pkill loolwsd || true

check-mobile: @JAILS_PATH@ node_modules
	$(call run_JS_error_check)
	$(call start_loolwsd)
	$(call run_mobile_tests,$(spec))
	@pkill loolwsd || true

run-desktop: @JAILS_PATH@ node_modules
	$(call start_loolwsd)
	@echo
	@echo "Open cypress with desktop tests..."
	@echo
	$(CYPRESS_BINARY) open --config integrationFolder=$(DESKTOP_TEST_FOLDER),userAgent=$(DESKTOP_USER_AGENT) \
			--env DATA_FOLDER=$(DESKTOP_DATA_FOLDER),WORKDIR=$(DESKTOP_WORKDIR),WSD_VERSION_HASH=$(LOOLWSD_VERSION_HASH) \
			|| true
	@pkill loolwsd || true

run-mobile: @JAILS_PATH@ node_modules
	$(call start_loolwsd)
	@echo
	@echo "Open cypress with mobile tests..."
	@echo
	$(CYPRESS_BINARY) open --config integrationFolder=$(MOBILE_TEST_FOLDER),userAgent=$(MOBILE_USER_AGENT) \
			--env DATA_FOLDER=$(MOBILE_DATA_FOLDER),WORKDIR=$(MOBILE_WORKDIR),WSD_VERSION_HASH=$(LOOLWSD_VERSION_HASH) \
			|| true
	@pkill loolwsd || true

define run_JS_error_check
	@echo "Checking for JS errors in test code..."
	@echo
	@NODE_PATH=$(abs_srcdir)/node_modules $(NODE) node_modules/eslint/bin/eslint.js $(abs_srcdir) \
		--ignore-path $(abs_srcdir)/.eslintignore --config $(abs_top_srcdir)/loleaflet/.eslintrc
	@echo
endef

define start_loolwsd
	@pkill loolwsd || true
	@echo "Launching loolwsd for testing..."
	@fc-cache "@LO_PATH@"/share/fonts/truetype
	@echo
	../loolwsd --o:sys_template_path="@SYSTEMPLATE_PATH@" \
			--o:child_root_path="@JAILS_PATH@" --o:storage.filesystem[@allow]=true \
			--disable-ssl \
			--o:admin_console.username=admin --o:admin_console.password=admin \
			--o:logging.file[@enable]=true --o:logging.level=trace > /dev/null 2>&1 &
	@node_modules/wait-on/bin/wait-on http://localhost:9980
	@echo
endef

define run_desktop_tests
	@echo
	@echo "Running cypress desktop tests..."
	@echo
	$(CYPRESS_BINARY) run --browser $(CHROME) \
			--config integrationFolder=$(DESKTOP_TEST_FOLDER),userAgent=$(DESKTOP_USER_AGENT) \
			--headless \
			--env DATA_FOLDER=$(DESKTOP_DATA_FOLDER),WORKDIR=$(DESKTOP_WORKDIR),WSD_VERSION_HASH=$(LOOLWSD_VERSION_HASH) \
			$(if $(1), --spec=integration_tests/desktop/$(1)) \
			|| (pkill loolwsd && false)
endef

define run_mobile_tests
	@echo
	@echo "Running cypress mobile tests..."
	@echo
	$(CYPRESS_BINARY) run --browser $(CHROME) \
			--config integrationFolder=$(MOBILE_TEST_FOLDER),userAgent=$(MOBILE_USER_AGENT) \
			--headless \
			--env DATA_FOLDER=$(MOBILE_DATA_FOLDER),WORKDIR=$(MOBILE_WORKDIR),WSD_VERSION_HASH=$(LOOLWSD_VERSION_HASH) \
			$(if $(1), --spec=integration_tests/mobile/$(1)) \
			|| (pkill loolwsd && false)
endef

node_modules:
	@npm install
	@touch node_modules

endif

clean-local:
	rm -rf node_modules
	rm -rf workdir
	rm -rf cypress
	rm -rf package-lock.json
endif
