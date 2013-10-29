noinst_SCRIPTS = aikosd

CLEANFILES = $(noinst_SCRIPTS)

# Generating executables from Python scripts
%: %.py
	$(INSTALL) --mode=755 $< $@
