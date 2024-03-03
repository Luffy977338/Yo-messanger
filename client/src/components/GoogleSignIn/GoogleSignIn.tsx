import { GoogleLogin } from "@react-oauth/google";
import { useGoogleAuth } from "../../hooks/AuthHooks";

const GoogleSignIn = () => {
  const googleAuth = useGoogleAuth();

  return (
    <GoogleLogin
      onSuccess={async (response) => {
        console.log(response);
        await googleAuth.mutateAsync(response.credential);
      }}
      onError={() => console.log("error")}
    />
  );
};

export default GoogleSignIn;
