SOURCE ?= $(CURDIR)/
TARGET ?= /Volumes/data/websites/subrythm.com/

.PHONY: deploy
deploy:
	@test -d "$(TARGET)" || (echo "Deploy target not found: $(TARGET)"; exit 1)
	rsync -av --delete \
		--exclude '.git/' \
		--exclude '.DS_Store' \
		--exclude '.smbdelete*' \
		"$(SOURCE)" "$(TARGET)"
	@date -u +marker-%Y-%m-%dT%H:%MZ > deploy-marker.txt
