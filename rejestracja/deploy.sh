GCLOUD_PROJECT_ID="jedrzej-lewandowski-doctor"
REPOSITORY="rejestracja"
LOCATION="europe-central2"
IMAGE_NAME="rejestracja"
SERVICE_NAME="rejestracja"
BASE_URL="https://rejestracja-349100221449.europe-central2.run.app/"
FRONTEND_URL="https://jblewandowski.com/praktyka/"

gcloud config set project "${GCLOUD_PROJECT_ID}"

TAG="$(date +%s)"
IMAGE_FULLNAME="${LOCATION}-docker.pkg.dev/${GCLOUD_PROJECT_ID}/${REPOSITORY}/${IMAGE_NAME}:${TAG}"
echo "Image: ${IMAGE_FULLNAME}"
docker build --platform linux/amd64 -t "${IMAGE_FULLNAME}" .
docker push "${IMAGE_FULLNAME}"

gcloud run deploy "${SERVICE_NAME}" \
  --image="${IMAGE_FULLNAME}" \
  --platform=managed \
  --region="${LOCATION}" \
  --allow-unauthenticated \
  --set-env-vars=BASE_URL="${BASE_URL}",FRONTEND_URL="${FRONTEND_URL}" \
  --max-instances=1 --max=1 \
  --memory=256Mi --cpu=1 \
  --port=80
