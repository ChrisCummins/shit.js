noinst_SCRIPTS = aikosd

CLEANFILES = $(noinst_SCRIPTS)

# Generating executables from Python scripts
%: %.py
	$(INSTALL) --mode=755 $< $@

test:
	@for f in $(noinst_SCRIPTS); do \
		./$$f; \
	done
