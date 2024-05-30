
import FullScreen from "../../../public/images/fullscreen.svg";
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
    <FullScreen />
    </button>
  );
};

export default FullScreenBtn;
