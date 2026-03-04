import CharacterStage from './components/CharacterStage';
import LoginForm from './components/LoginForm';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.container}>
      <div className={styles.leftHalf}>
        <CharacterStage />
      </div>
      <div className={styles.rightHalf}>
        <LoginForm />
      </div>
    </div>
  );
}

export default App;

