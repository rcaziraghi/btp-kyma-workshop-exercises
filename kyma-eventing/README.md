## Steps to build and deploy the Kyma eventing example

1. Build the docker image of the **event-registration-ui microservice**.

	- docker build . -t `<docker-username>`/event-reg-ui -f ./event-registration-ui/Dockerfile

2. Push the docker image of the **event-registration-ui microservice**.

	- docker push `<docker-username>`/event-reg-ui

3. Update the docker image in the ./event-registration-ui/k8s/deployment.yaml file.

4. Create/update Kubernetes resources of the **event-registration-ui microservice**.

	- kubectl apply -f ./event-registration-ui/k8s/config-map.yaml
	- kubectl apply -f ./event-registration-ui/k8s/deployment.yaml
	- kubectl apply -f ./event-registration-ui/k8s/secret.yaml
	- kubectl apply -f ./event-registration-ui/k8s/service.yaml
	- kubectl apply -f ./event-registration-ui/k8s/subscription.yaml

5. Create/update Kubernetes resources of the **event-emitter serverless function**.

	- kubectl apply -f ./event-emitter/k8s/function.yaml

6. Create/update Kubernetes resources of the **event-consumer serverless function**.

	- kubectl apply -f ./event-emitter/k8s/function.yaml
