
DOCKER_ACCOUNT=<your docker account>

build-capimage: ## Build the container without caching
	docker build --pull --rm -f Dockerfile -t $(DOCKER_ACCOUNT)/caps4bp:latest .

build-uiimage:
	docker build --pull --rm -f app/ui.Dockerfile -t $(DOCKER_ACCOUNT)/caps4bpui:latest ./app

push-images: build-capimage build-uiimage
	docker push $(DOCKER_ACCOUNT)/caps4bp:latest
	docker push $(DOCKER_ACCOUNT)/caps4bpui:latest
