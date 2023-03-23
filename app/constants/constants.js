const paymentRequest_Address = "0xAB35BF389100395f9c420e07c2D2d697Eb46ef7b";
const payments_Address = "0xa7da0579d3967C125A91e20BEE581eAb0CC68805";
const payoutManager_Address = "0x34C460FcEAd74eBEaC8F77d3Cf67F24d9FEF1Fda";
const personalized_Address = "0xC1513C7F031BDE4e3952632db243459C3A413c04";
const profileManager_Address = "0x82f8e74d48CE2f83725848F8158a1233aBEc9125";
const walletVerifier_Address = "0xa32964d2683E2667951cEecb1Eda234336b92583";
const giftCardCreator_Address = "0x8F84c6343A2230B7f6a5D1D81B546d2f669D5697";
const funds_Address = "0xF7E51F72aA8c634B9795E532Eb1b37Ff6D8FDa04";

export const WEB3STORAGE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDMxQjM3MjRlN2E2RjgyMTg3NEFEYzMyYjEzZDQwNjM2YkFiMDA0NzEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTg0MTc0ODY2ODksIm5hbWUiOiJDYXplIn0.BoGp0mNQc_syBHBZFj6Mb2dTUjAlpLWHd6DwCwFSc_4";
export const NFT_STORAGE_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEVERWJCMEZCNTk3REI4MTUxNkU5M2Y4YmM3RjJmQ0Q2ODYzNDAyOEUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1ODU4MDY5OTE4MSwibmFtZSI6Ik11c2ljMyJ9.V6Ny_9VV_XLIIFDFIEG8alEdJTwxmfHJMaMDJEf00L4";

import { abi as paymentRequest_ABI } from "./Artifacts/paymentRequest.sol/paymentRequests.json";
import { abi as payments_ABI } from "./Artifacts/payments.sol/payments.json";
export { abi as payout_ABI } from "./Artifacts/payout.sol/payout.json";
import { abi as payoutManager_ABI } from "./Artifacts/payoutManager.sol/payoutManager.json";
import { abi as personalized_ABI } from "./Artifacts/personalizedPage.sol/personalizedPayPage.json";
import { abi as profileManager_ABI } from "./Artifacts/profileManager.sol/profileManager.json";
export { abi as profielWallet_ABI } from "./Artifacts/profileWallet.sol/profileWallet.json";
import { abi as walletVerfier_ABI } from "./Artifacts/walletVerifier.sol/walletVerifier.json";
export { abi as giftCard_ABI } from "./Artifacts/giftcard.sol/giftcard.json";
import { abi as giftCardCreator_ABI } from "./Artifacts/gcCreator.sol/gcCreator.json";
import { abi as funds_ABI } from "./Artifacts/Funds.sol/Funds.json";

export const paymentRequest_data = {
  abi: paymentRequest_ABI,
  address: paymentRequest_Address,
};

export const payments_data = {
  abi: payments_ABI,
  address: payments_Address,
};

export const payoutManager_data = {
  abi: payoutManager_ABI,
  address: payoutManager_Address,
};

export const personalized_data = {
  abi: personalized_ABI,
  address: personalized_Address,
};

export const profileManager_data = {
  abi: profileManager_ABI,
  address: profileManager_Address,
};

export const walletVerifier_data = {
  abi: walletVerfier_ABI,
  address: walletVerifier_Address,
};

export const giftCardCreator_data = {
  abi: giftCardCreator_ABI,
  address: giftCardCreator_Address,
};

export const funds_data = {
  abi: funds_ABI,
  address: funds_Address,
};
