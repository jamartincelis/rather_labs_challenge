# rather_labs_challenge

# Build the image

docker build -t jamartincelis/node-hello-app .

# Run a container to test it

docker run --rm -d -p 3000:3000 jamartincelis/node-hello-app

# Push the image to DockerHub: 

docker push jamartincelis/node-hello-app

# Create a deployment: 

kubectl create deployment --image jamartincelis/node-hello-app node-app

# Scale up to 3 replicas

kubectl scale deployment node-app --replicas 3

# Expose the deployment as a NodePort replica:

kubectl expose deployment node-app --type=NodePort --port 3000

