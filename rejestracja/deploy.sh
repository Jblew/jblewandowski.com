GCLOUD_PROJECT_ID="jedrzej-lewandowski-doctor"
REPOSITORY="rejestracja"
LOCATION="europe-central2"
IMAGE_NAME="rejestracja"
SERVICE_NAME="rejestracja"
BASE_URL="https://jblewandowski.com/praktyka/rejestracja/"
FRONTEND_URL="https://jblewandowski.com/praktyka/"
TPAY_API_URL=https://openapi.sandbox.tpay.com
TPAY_CLIENT_ID=01KGN5HFN06QV11KCV8ZFCCQ2F-01KGN5KFFG7F75DSB4R14D0HB4
TPAY_CLIENT_SECRET=7c0af935358d6e66ec5e35331d4e9a77f4769051c0fd82fa8a243d1ee2ba61c5
FAKTUROWNIA_URL=https://jedrzejlewandowski.fakturownia.pl
FAKTUROWNIA_API_TOKEN=Mdngyu8yPkc9cAs41JW8

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
  --set-env-vars=BASE_URL="${BASE_URL}",FRONTEND_URL="${FRONTEND_URL}",TPAY_API_URL="${TPAY_API_URL}",TPAY_CLIENT_ID="${TPAY_CLIENT_ID}",TPAY_CLIENT_SECRET="${TPAY_CLIENT_SECRET}",FAKTUROWNIA_URL="${FAKTUROWNIA_URL}",FAKTUROWNIA_API_TOKEN="${FAKTUROWNIA_API_TOKEN}" \
  --max-instances=1 --max=1 \
  --memory=256Mi --cpu=1 \
  --port=80
