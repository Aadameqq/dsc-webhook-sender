const classes = ["username", "avatar_link", "content", "token"];

let isSwitched = [false, false];

let finalClasses;

const styles = {
  errorInputStyle:
    "border-bottom: 2px solid #e04439;border-left: 2px solid rgb(44, 44, 44);border-right: 2px solid rgb(44, 44, 44);",
  normalInputStyle:
    " border-bottom: 2px solid  rgb(20, 20, 20);border-top: none;border-left: none;border-right: none;",
  hide: "display:none;",
  show: "display:block;",
  checkbox: {
    offColor: "background-color: rgb(68, 67, 67);",
    onColor: "background-color: rgb(0, 156, 228);",
    offShade: "background-color: rgb(87, 85, 85);",
    onShade: "background-color: rgb(31, 175, 241);",
  },
  navbarCheckbox: {
    on: "",
    off: "",
  },
};
const switchesState = {
  embed: false,
  blockPing: false,
  customColor: false,
};

const submitButton = document.querySelector(`#submit`);
const successDiv = document.querySelector(`#success`);
const errorDiv = document.querySelector(`#error`);
const embedSwitchDiv = document.querySelector(`#is-embed`);
const blockPingSwitchDiv = document.querySelector(`#is-blocking-ping`);
const customColorSwitchDiv = document.querySelector(`#is-custom-color`);

const switches = [...document.querySelectorAll(`.form__checkbox__label`)];

const onSubmit = () => {
  finalClasses = classes;

  if (switchesState.embed) {
    finalClasses.push("embedTitle");
    !switchesState.customColor
      ? finalClasses.push("embedColor")
      : finalClasses.push("customEmbedColor");
    finalClasses = finalClasses.filter((x) => x !== "content");
    finalClasses.push("embedContent");
  }
  cleanComunicates();
  let args = {};
  finalClasses.map((x) => {
    args[x] = document.querySelector(`#${x}`).value;
  });
  if (!args.token) {
    errorDiv.innerHTML = "Nie podałeś linku";
    document.querySelector(`#token`).style = styles.errorInputStyle;
    return;
  }
  if (!args.token.includes(`discord.com/`)) {
    errorDiv.innerHTML = "Podałeś niepoprawny link";
    document.querySelector(`#token`).style = styles.errorInputStyle;
    return;
  }
  if (validate(args.username, "Nick", (minLength = 4), (maxLength = 200))) {
    document.querySelector(`#username`).style = styles.errorInputStyle;
    return;
  }
  if (
    switchesState.blockPing &&
    finalClasses.includes("content") &&
    validate(args.content, "Treść", 4, 200, ["@everyone", "@here"])
  ) {
    document.querySelector(`#content`).style = styles.errorInputStyle;
    return;
  }

  const customColorHexRegex = /^#([0-9]|[a-f]){6}$/;

  if (
    (switchesState.customColor &&
      args.customEmbedColor.match(customColorHexRegex) === null) ||
    (finalClasses.includes("embedColor") && args.embedColor === "none")
  ) {
    errorDiv.innerHTML = "Nie wybrałeś poprawnego koloru";
    switchesState.customColor
      ? (document.querySelector(`#customEmbedColor`).style =
          styles.errorInputStyle)
      : (document.querySelector(`#embedColor`).style = styles.errorInputStyle);
    return;
  }

  send(args);
};

const send = async (data) => {
  try {
    const response = await fetch(data.token, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        !switchesState.embed
          ? {
              content: data.content,
              username: data.username,
              avatar_url: data.avatar_link,
            }
          : {
              embeds: [
                {
                  title: data.embedTitle,
                  description: data.embedContent,
                  color: data.customEmbedColor
                    ? parseInt(data.customEmbedColor.replace("#", ""), 16)
                    : data.embedColor,
                },
              ],
              username: data.username,
              avatar_url: data.avatar_link,
            }
      ),
    });
    if (!response.ok) {
      const error = new Error("HTTP ERROR");
      error.status = response.status;
      throw error;
    }

    successDiv.innerHTML = "Wysłano poprawnie";
  } catch (e) {
    if (e.status.toString().startsWith(4)) {
      errorDiv.innerHTML = "Nie znaleziono podanego webhooka";
    } else if (e.status.toString().startsWith(5)) {
      errorDiv.innerHTML =
        "Doszło do błędu podczas łączenia się z webhookiem. Spróbuj ponownie później";
    }
  }
};

const cleanComunicates = () => {
  errorDiv.innerHTML = "";
  successDiv.innerHTML = "";
  if (!finalClasses) return;
  for (classElement of finalClasses) {
    document.querySelector(`#${classElement}`).style.border = "";
  }
};

const onCheckEmbed = () => {
  document.querySelector(`#content`).style = switchesState.embed
    ? styles.show
    : styles.hide;

  document.querySelector(`#embed`).style = switchesState.embed
    ? styles.hide
    : styles.show;

  document.querySelector(`#is-blocking-ping-container`).style =
    !switchesState.embed ? styles.hide : "";

  !switchesState.embed &&
    (document.querySelector(`#customEmbedColor`).style = styles.hide);

  switchesState.embed &&
    switchesState.customColor &&
    customColorSwitchDiv.click();

  !switchesState.embed && switchesState.blockPing && blockPingSwitchDiv.click();
  switchesState.embed = !switchesState.embed;
};

const onCheckCustomColor = () => {
  document.querySelector(`#embedColor`).style = switchesState.customColor
    ? styles.show
    : styles.hide;

  document.querySelector(`#customEmbedColor`).style = switchesState.customColor
    ? styles.hide
    : styles.show;

  switchesState.customColor &&
    (document.querySelector(`#customEmbedColor`).value = "");

  switchesState.customColor = !switchesState.customColor;
};

const onCheckBlockingPing = () =>
  (switchesState.blockPing = !switchesState.blockPing);

const onCheckStyle = (id) => {
  switches[id].style = isSwitched[id]
    ? styles.checkbox.offColor
    : styles.checkbox.onColor;

  isSwitched[id] = !isSwitched[id];
};

const onMouseEnter = (id) => {
  switches[id].style = isSwitched[id]
    ? styles.checkbox.onShade
    : styles.checkbox.offShade;
};
const onMouseLeave = (id) => {
  switches[id].style = !isSwitched[id]
    ? styles.checkbox.offColor
    : styles.checkbox.onColor;
};

const validate = (
  value,
  name,
  minLength = 3,
  maxLength = 2000,
  blockedWords = null
) => {
  if (!value) {
    errorDiv.innerHTML = `Pole ${name} jest puste`;
    return true;
  }
  if (value.length < minLength) {
    errorDiv.innerHTML = `Pole ${name} musi mieć co najmniej ${minLength} znaków`;
    return true;
  }
  if (value.length > maxLength) {
    errorDiv.innerHTML = `Pole ${name} może mieć maksymalnie ${maxLength} znaków`;
    return true;
  }
  if (blockedWords) {
    let includes = false;
    blockedWords.map((x) => {
      if (value.includes(x)) includes = true;
    });
    if (includes) {
      errorDiv.innerHTML = `Pole ${name} zawiera ping`;
      return true;
    }
  }
};

embedSwitchDiv.addEventListener("click", onCheckEmbed);
blockPingSwitchDiv.addEventListener("click", onCheckBlockingPing);
customColorSwitchDiv.addEventListener("click", onCheckCustomColor);
submitButton.addEventListener("click", onSubmit);

for (let i = 0; i < switches.length; i++) {
  switches[i].children[0].addEventListener("click", () => onCheckStyle(i));
  switches[i].addEventListener("mouseenter", () => onMouseEnter(i));
  switches[i].addEventListener("mouseleave", () => onMouseLeave(i));
}
