
import styles from "@/components/VideoPlayer/VideoPlayer.module.css";

interface fullScreenProps {
  isFullScreen: boolean;
  onExpandCollapse: () => void;
}
const FullScreenBtn = ({ isFullScreen, onExpandCollapse } : fullScreenProps): JSX.Element => {
  return (
    <button
      className={styles.controlBtn}
      id={styles.fullScreen}
      onClick={() => onExpandCollapse()}
    >
      {isFullScreen ? (
        <i className="fa-solid fa-compress"></i>
      ) : (
        <i className="fa-solid fa-expand"></i>
      )}
    </button>
  );
};

export default FullScreenBtn;
