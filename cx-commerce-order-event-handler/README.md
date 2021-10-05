# CX Commerce Order Event handler example

## Pre-requisites

- [Install Docker](https://docs.docker.com/get-docker/) (or any other Container tool).
- Create an account at [https://hub.docker.com/](https://hub.docker.com/) (or any other Container Image Library). 
- Create a [SendGrid account](https://sendgrid.com/solutions/email-api/) for sending emails.
- [Get a Free Account on SAP BTP Trial](https://developers.sap.com/tutorials/hcp-create-trial-account.html).
- [Enable SAP BTP, Kyma Runtime](https://developers.sap.com/tutorials/cp-kyma-getting-started.html).
- [Download and install the Kubernetes Command Line Tool](https://developers.sap.com/tutorials/cp-kyma-download-cli.html#d81e7789-ced4-4df6-b4a0-132d8c637077).
- [Test the kubectl installation](https://developers.sap.com/tutorials/cp-kyma-download-cli.html#4709f3b9-b9bc-45f1-89c1-cd6f097c55f5).
- [Download the Kyma runtime kubeconfig](https://developers.sap.com/tutorials/cp-kyma-download-cli.html#2ef10816-b759-4080-a8ec-eadbc3317ebd).

## Build and deployment steps

1. Build the docker image of the **commerce-mock microservice**. 

	- cd cx-commerce-order-event-handler/commerce-mock

	- docker build . -t `<docker-username>`/commerce-mock -f ./commerce-mock/Dockerfile

	> Note: Replace `<docker-username>` with your username

2. Push the docker image of the **commerce-mock microservice** to your Container Image Library.

	- docker push `<docker-username>`/commerce-mock
	
	> Note: Replace `<docker-username>` with your username

3. Update the docker image in the ./commerce-mock/deployment/k8s.yaml file.

	> Note: Replace `<docker-username>` with your username

4. Create/update Kubernetes resources of the **commerce-mock microservice**.

	- kubectl apply -f ./commerce-mock/deployment/k8s.yaml
	- kubectl apply -f ./commerce-mock/deployment/kyma.yaml

5. Update the values of the `SENDGRID_API_KEY` & `SENDGRID_SENDER_EMAIL` environment variables in the  ./order-event-handler/k8s/function.yaml file, which can be got from your SendGrid account.

6. Create/update Kubernetes resources of the **order-event-handler serverless function**.

	- kubectl apply -f ./order-event-handler/k8s/function.yaml
