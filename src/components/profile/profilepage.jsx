import style from "./profile.module.css";
const ProfilePage = () => {
  return (
    <main>
      <header className={`flex row ${style.header}`}>
        <div className={`${style.pfp}`}></div>
        <div className={`flex col ${style.nameAndStats}`}>
          <span></span>
          <span></span>
          <div className={`${style.stats}`}></div>
        </div>
        <button>Follow</button>
      </header>
    </main>
  );
};
export default ProfilePage;
