const ChangeUser = ({ state, handleChangeCurrentUser }) => {
  return (
    <div className="change-user">
      <label htmlFor="change-user__dropdown">Change User:</label>
      <picture className="change-user__profile-picture">
        <source srcSet={state.currentUser.image.webp} type="image/webp" />
        <source srcSet={state.currentUser.image.png} type="image/png" />
        <img
          src={state.currentUser.image.png}
          alt={state.currentUser.image.alt}
        />
      </picture>
      <select
        id="change-user__dropdown"
        className="change-user__dropdown"
        value={state.users[state.currentUser.id].id}
        onChange={(e) => handleChangeCurrentUser(e)}
      >
        {state.users.map((user, index) => (
          <option key={user.id} value={index}>
            {user.username}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ChangeUser;
