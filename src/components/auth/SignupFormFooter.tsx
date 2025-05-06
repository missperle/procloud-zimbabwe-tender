
import { Link } from "react-router-dom";

const SignupFormFooter = () => {
  return (
    <div className="text-center text-sm">
      <span className="text-gray-600">Already have an account? </span>
      <Link to="/login" className="text-procloud-green font-medium hover:underline">
        Log in
      </Link>
    </div>
  );
};

export default SignupFormFooter;
