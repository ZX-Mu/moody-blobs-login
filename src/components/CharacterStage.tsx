import OrangeBlob from "./characters/OrangeBlob";
import PurpleRect from "./characters/PurpleRect";
import BlackBar from "./characters/BlackBar";
import YellowCylinder from "./characters/YellowCylinder";
import styles from './CharacterStage.module.css';

const CharacterStage = () => {
  return (
    <div className={styles.stage}>
      {/* 橙色 — 左前景，最矮，z最高 */}
      <div className={styles.orange}>
        <OrangeBlob />
      </div>
      {/* 紫色 — 后景居中，最高 */}
      <div className={styles.purple}>
        <PurpleRect />
      </div>
      {/* 黑色 — 中景 */}
      <div className={styles.black}>
        <BlackBar />
      </div>
      {/* 黄色 — 右前景 */}
      <div className={styles.yellow}>
        <YellowCylinder />
      </div>
    </div>
  );
};

export default CharacterStage;
