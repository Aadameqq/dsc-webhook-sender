const handleResize = () => {
  if (window.innerWidth > 800) {
    if (isBurgerClicked) {
      navbarBurger.click();
    }

    isBurgerClicked = false;
    navbarItems.style = "";
  }
};

window.addEventListener("resize", handleResize);
