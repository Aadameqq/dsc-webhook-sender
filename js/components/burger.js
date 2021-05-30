const navbarBurger = document.querySelector(`#navbar-burger`);
const navbarItems = document.querySelector(`#navbar-items`);
const gradientBackground = document.querySelector(`#main`);

let isBurgerClicked = false;

const onBurgerClick = () => {
  navbarItems.style = isBurgerClicked
    ? "transform:translateY(210px);opacity: 0;visibility: hidden;"
    : "transform:translateY(210px);opacity: 1; visibility: visible;";

  if (isBurgerClicked) {
    setTimeout(() => {
      if (
        navbarItems.style ===
        "transform:translateY(210px);opacity: 0;visibility: hidden;"
      )
        navbarItems.style = "";
    }, 1000);
  }
  isBurgerClicked = !isBurgerClicked;
};

navbarBurger.addEventListener("click", onBurgerClick);
