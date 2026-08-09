SOURCE ?= $(CURDIR)/
NAS_SITE_DIR ?= subrythm.com
GORFEDNET_SCRIPTS := $(abspath $(dir $(lastword $(MAKEFILE_LIST)))/../gorfednet.github/scripts)

RSYNC_FLAGS := -av --delete \
	--exclude '.git/' \
	--exclude '.DS_Store'

.PHONY: deploy

deploy:
	@bash -c 'set -euo pipefail; \
	  source "$(GORFEDNET_SCRIPTS)/nas-ssh-deploy.sh"; \
	  nas_ssh_load_env "$(CURDIR)"; \
	  NAS_SITE_DIR="$(NAS_SITE_DIR)"; \
	  nas_ssh_preflight "$$NAS_SITE_DIR"; \
	  nas_ssh_rsync_to "$$(nas_ssh_target "$$NAS_SITE_DIR")" $(RSYNC_FLAGS) "$(SOURCE)"; \
	  date -u +marker-%Y-%m-%dT%H:%MZ > deploy-marker.txt; \
	  echo "Deployed to $$(nas_ssh_target "$$NAS_SITE_DIR")"'
