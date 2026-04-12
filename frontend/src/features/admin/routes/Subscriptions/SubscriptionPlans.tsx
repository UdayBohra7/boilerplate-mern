import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Elements";
import bg from "@/assets/planbg.png";
import check from "@/assets/check.svg";
export const SubscriptionPlans = () => {
  const navigate = useNavigate();

  return (
    <div
      className="px-4 py-5 subscription-bg"
      style={{
        background: `url(${bg})`,
        backgroundPosition: "right",
        backgroundSize: "cover",
        minHeight: "90vh",
      }}
    >
      <div className="user-management subscript-plans">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 600,
                color: "#2D3436",
                marginBottom: "4px",
              }}
            >
              Subscription Plans
            </h2>
            <p style={{ color: "#636E72", fontSize: "14px", margin: 0 }}>
              Manage and monitor all registered users
            </p>
          </div>
          <Button className="btn d-flex align-items-center gap-2">
            <i className="fa-solid fa-plus"></i>
            Add Plan
          </Button>
        </div>
        <div className="row">
          <div className="col-12 col-md-4">
            <div className="plans-box">
              <p className="text-center mb-1">Pro Plan</p>
              <h2 className="text-center pink f-42 font-medium">$29.99 USD</h2>
              <p className="f-14 text-center gray">
                Your Pro plan is for 3 months
              </p>
              <div className="plans-list">
                <p className="mb-0 f-14 py-1 d-flex align-items-center gap-2">
                  <img src={check} className="track-check" /> Unlimited Meal
                  Tracking
                </p>
                <p className="mb-0 f-14 py-1 d-flex align-items-center gap-2">
                  <img src={check} className="track-check" /> Personalized
                  Workout Plans
                </p>
                <p className="mb-0 f-14 py-1 d-flex align-items-center gap-2">
                  <img src={check} className="track-check" /> Exclusive Recipes
                  & Meal Plans
                </p>
                <p className="mb-0 f-14 py-1 d-flex align-items-center gap-2">
                  <img src={check} className="track-check" /> 1-on-1 Coaching
                  Sessions
                </p>
                <p className="mb-0 f-14 py-1 d-flex align-items-center gap-2">
                  <img src={check} className="track-check" /> Advanced Progress
                  Insights
                </p>
                <p className="mb-0 f-14 py-1 d-flex align-items-center gap-2">
                  <img src={check} className="track-check" /> Priority Support
                </p>
                <p className="mb-0 f-14 py-1 d-flex align-items-center gap-2">
                  <img src={check} className="track-check" /> Access to
                  Marissa’s Exclusive Content
                </p>
              </div>
              <Button className="mt-4 w-100 border-0" style={{backgroundColor: "#F882A1"}}>Subscribe</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
