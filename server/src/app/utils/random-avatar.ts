function randomAvatar() {
  const n = Math.floor(Math.random() * 99) + 1;
  const gender = Math.random() < 0.5 ? "men" : "women";
  return `https://randomuser.me/api/portraits/${gender}/${n}.jpg`;
}

export default randomAvatar;
