import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MediaItem {
  type: "image" | "video";
  url: string;
}

interface MediaGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaItem[];
  initialIndex?: number;
}

export const MediaGalleryModal = ({
  isOpen,
  onClose,
  media,
  initialIndex = 0,
}: MediaGalleryModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationCooldown = useRef<NodeJS.Timeout | null>(null);

  // Cooldown duration in milliseconds
  const COOLDOWN_MS = 400;

  // Reset index when modal opens with new initial index
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsNavigating(false);
    }
  }, [isOpen, initialIndex]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (navigationCooldown.current) {
        clearTimeout(navigationCooldown.current);
      }
    };
  }, []);

  // Start cooldown after navigation
  const startCooldown = useCallback(() => {
    setIsNavigating(true);
    if (navigationCooldown.current) {
      clearTimeout(navigationCooldown.current);
    }
    navigationCooldown.current = setTimeout(() => {
      setIsNavigating(false);
    }, COOLDOWN_MS);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && !isNavigating) {
        goToPrevious();
      } else if (e.key === "ArrowRight" && !isNavigating) {
        goToNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, currentIndex, isNavigating]);

  const goToNext = useCallback(() => {
    if (currentIndex < media.length - 1 && !isNavigating) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
      startCooldown();
    }
  }, [currentIndex, media.length, isNavigating, startCooldown]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0 && !isNavigating) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
      startCooldown();
    }
  }, [currentIndex, isNavigating, startCooldown]);

  const goToIndex = (index: number) => {
    if (isNavigating || index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    startCooldown();
  };

  // Handle swipe gestures
  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    if (isNavigating) return;
    
    const swipeThreshold = 50;
    const velocityThreshold = 500;

    if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      goToPrevious();
    } else if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      goToNext();
    }
  };

  if (!isOpen || media.length === 0) return null;

  const currentMedia = media[currentIndex];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.95)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={onClose}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "rgba(255, 255, 255, 0.1)",
              border: "none",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 10,
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")}
          >
            <i className="fa-solid fa-times" style={{ color: "#fff", fontSize: "20px" }}></i>
          </button>

          {/* Counter */}
          {media.length > 1 && (
            <div
              style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                color: "#fff",
                fontSize: "14px",
                background: "rgba(0, 0, 0, 0.5)",
                padding: "8px 16px",
                borderRadius: "20px",
                zIndex: 10,
              }}
            >
              {currentIndex + 1} / {media.length}
            </div>
          )}

          {/* Navigation Arrows */}
          {media.length > 1 && (
            <>
              {/* Previous Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                disabled={currentIndex === 0 || isNavigating}
                style={{
                  position: "absolute",
                  left: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: currentIndex === 0 || isNavigating ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  borderRadius: "50%",
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: currentIndex === 0 || isNavigating ? "not-allowed" : "pointer",
                  zIndex: 10,
                  transition: "background 0.2s, opacity 0.2s",
                  opacity: isNavigating ? 0.5 : 1,
                }}
                onMouseOver={(e) => {
                  if (currentIndex !== 0 && !isNavigating) {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background =
                    currentIndex === 0 || isNavigating ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.1)";
                }}
              >
                <i
                  className="fa-solid fa-chevron-left"
                  style={{
                    color: currentIndex === 0 || isNavigating ? "rgba(255,255,255,0.3)" : "#fff",
                    fontSize: "20px",
                  }}
                ></i>
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                disabled={currentIndex === media.length - 1 || isNavigating}
                style={{
                  position: "absolute",
                  right: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background:
                    currentIndex === media.length - 1 || isNavigating
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  borderRadius: "50%",
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: currentIndex === media.length - 1 || isNavigating ? "not-allowed" : "pointer",
                  zIndex: 10,
                  transition: "background 0.2s, opacity 0.2s",
                  opacity: isNavigating ? 0.5 : 1,
                }}
                onMouseOver={(e) => {
                  if (currentIndex !== media.length - 1 && !isNavigating) {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background =
                    currentIndex === media.length - 1 || isNavigating
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(255, 255, 255, 0.1)";
                }}
              >
                <i
                  className="fa-solid fa-chevron-right"
                  style={{
                    color: currentIndex === media.length - 1 || isNavigating ? "rgba(255,255,255,0.3)" : "#fff",
                    fontSize: "20px",
                  }}
                ></i>
              </button>
            </>
          )}

          {/* Media Container */}
          <div className="media-gallery-container"
            style={{
              position: "relative",
              width: "100%",
              height: "calc(100vh - 160px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                drag={media.length > 1 && !isNavigating ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: media.length > 1 ? "grab" : "default",
                }}
              >
                {currentMedia.type === "video" ? (
                  <video
                    src={currentMedia.url}
                    controls
                    autoPlay
                    style={{
                      maxWidth: "90%",
                      maxHeight: "100%",
                      borderRadius: "8px",
                      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <motion.img
                    src={currentMedia.url}
                    alt={`Media ${currentIndex + 1}`}
                    style={{
                      maxWidth: "90%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      borderRadius: "8px",
                      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
                      userSelect: "none",
                      pointerEvents: "none",
                    }}
                    draggable={false}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Thumbnail Navigation */}
          {media.length > 1 && (
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "8px",
                padding: "12px 16px",
                background: "rgba(0, 0, 0, 0.5)",
                borderRadius: "12px",
                maxWidth: "90%",
                overflowX: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {media.map((item, index) => (
                <button
                  key={index}
                  onClick={() => goToIndex(index)}
                  disabled={isNavigating}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "8px",
                    border: currentIndex === index ? "2px solid #F882A1" : "2px solid transparent",
                    padding: 0,
                    cursor: isNavigating ? "not-allowed" : "pointer",
                    overflow: "hidden",
                    position: "relative",
                    opacity: currentIndex === index ? 1 : isNavigating ? 0.4 : 0.6,
                    transition: "all 0.2s",
                    flexShrink: 0,
                  }}
                >
                  {item.type === "video" ? (
                    <>
                      <video
                        src={item.url}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          background: "rgba(0, 0, 0, 0.6)",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i
                          className="fa-solid fa-play"
                          style={{ color: "#fff", fontSize: "10px", marginLeft: "2px" }}
                        ></i>
                      </div>
                    </>
                  ) : (
                    <img
                      src={item.url}
                      alt={`Thumbnail ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Swipe Hint for Mobile */}
          {media.length > 1 && (
            <div
              style={{
                position: "absolute",
                bottom: "100px",
                left: "50%",
                transform: "translateX(-50%)",
                color: "rgba(255, 255, 255, 0.5)",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <i className="fa-solid fa-hand-pointer"></i>
              Swipe or use arrow keys to navigate
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MediaGalleryModal;

