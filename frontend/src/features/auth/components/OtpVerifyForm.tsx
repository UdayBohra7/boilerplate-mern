import "../routes/auth.css";
import { AnimatePresence, motion } from "framer-motion";
import { animations } from "./Layout";
import useAnimateFn from "@/hooks/animate";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyOtp, resendOtp } from "../api/forget";

export const OtpVerifyForm = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { animate, callAfterAnimateFn } = useAnimateFn();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const resetToken = localStorage.getItem("resetToken");
    if (!resetToken) {
      toast.error("Session expired. Please try again.");
      navigate("/auth/forget");
      return;
    }

    try {
      setLoading(true);
      await verifyOtp(resetToken, { otp: code });
      setShowModal(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const emailToken = localStorage.getItem("emailToken");
    if (!emailToken) {
      toast.error("Session expired. Please try again.");
      navigate("/auth/forget");
      return;
    }

    try {
      setResending(true);
      const response = await resendOtp({ emailToken });
      
      // Update the reset token with new one
      localStorage.setItem("resetToken", response.data);
      
      toast.success(response.message || "New code has been sent to your email!");
    } catch (error) {
      console.error(error);
    } finally {
      setResending(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/auth/reset");
  };

  // Auto-close modal after 2 seconds
  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        handleModalClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  return (
    <AnimatePresence>
      {animate && (
        <motion.div {...animations}>
          <h2 className="auth-form-title">Verify Code</h2>
          <p className="auth-form-subtitle">
            An authentication code has been sent to your email address
          </p>

          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label className="auth-label">Enter Code</label>
              <input
                type="text"
                placeholder="Enter verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <div className="auth-resend-link text-black">
              Didn't receive a code?{" "}
              <Link 
                to="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (!resending) handleResend();
                }}
              >
                {resending ? "Sending..." : "Resend"}
              </Link>
            </div>

            <button
              type="submit"
              className="auth-submit-btn mt-5"
              disabled={loading || code.length === 0}
            >
              {loading && <span className="auth-spinner" />}
              Continue
            </button>

            
          </form>
          <div className="auth-back-link">
            <Link
              to="#"
              onClick={callAfterAnimateFn(() => navigate("/auth/login"))}
            >
              Back to  SignIn
            </Link>
          </div>
          {/* Success Modal */}
          {showModal && (
            <div className="auth-modal-overlay" onClick={handleModalClose}>
              <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                <div className="auth-modal-icon">
                  <div className="auth-modal-icon-outer">
                    <div className="auth-modal-icon-inner">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <h3 className="auth-modal-title">OTP Verified!</h3>
                <p className="auth-modal-text">
                  Your OTP has been verified successfully
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
