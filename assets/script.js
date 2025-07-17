const bodyElement = document.body;
const extra_set = document.getElementById("extra_set");
const notFoundText = () => document.getElementById("not_found_text");

Promise.all([

  fetch("https://item-starexx.vercel.app/assets/cdn.json").then((response) => response.json()),

  fetch(
    `https://item-starexx.vercel.app/assets/cdn.json`,
  ).then((response) => response.json()),

  fetch("https://items.kibomodz.online/assets/itemData.json").then((response) => response.json()),
])
  .then(([cdnData, pngsData, itemDatar]) => {
    cdn_img_json = cdnData.reduce((map, obj) => Object.assign(map, obj), {});
    pngs_json_list = pngsData;
    itemData = itemDatar;

    handleDisplayBasedOnURL();
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

function addParameterWithoutRefresh(param, value) {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set(param, value);
  const newUrl = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;
  history.pushState({ path: newUrl }, "", newUrl);
}

function getUrlWithoutParameters() {
  const newUrl = `${window.location.origin}${window.location.pathname}`;
  return newUrl;
}

function Share_tg() {
  var iconName = document
    .getElementById("dialog-tittle-pp")
    .textContent.replace("Icon Name: ", "");
  var url =
    getUrlWithoutParameters() +
    "?q=" +
    iconName +
    "&mode=" +
    itemID.state.displayMode;
  var message =
    "Title: `" +
    document.getElementById("dialog-tittle").textContent +
    "`\nID: `" +
    document.getElementById("dialog-tittle-p").textContent.replace("Id: ", "") +
    "`\nIcon Name: `" +
    iconName +
    "`\n\nView: " +
    url;
  window.open(
    "https://t.me/share/url?url=" + encodeURIComponent(message) + "&text=",
  );
}
async function displayPage(pageNumber, searchTerm, webps) {
  current_data = webps;
  let filteredItems;
  if (!searchTerm.trim()) {
    filteredItems = webps;
  } else {
    filteredItems = filterItemsBySearch(webps, searchTerm);
  }
  const startIdx = (pageNumber - 1) * itemID.config.perPageLimitItem;
  const endIdx = Math.min(
    startIdx + itemID.config.perPageLimitItem,
    filteredItems.length,
  );
  const webpGallery = document.getElementById("webpGallery");
  const fragment = document.createDocumentFragment();
  webpGallery.innerHTML = "";
  for (let i = startIdx; i < endIdx; i++) {
    const item = filteredItems[i];
    const image = document.createElement("img");
    image.className = "image border p-3 bounce-click ";
    image.loading = "lazy";
    image.id = "list_item_img";
    image.setAttribute("crossorigin", "anonymous");
    image.setAttribute("alt", item.description);

    let imgSrc = `https://raw.githubusercontent.com/starexxx/FFItems/5dd347a94489bfcf99d3537d0800eca32c7a7a08/assets/error-404.png`;
    if (pngs_json_list?.includes(item.icon + ".png")) {
      imgSrc = `https://raw.githubusercontent.com/I-SHOW-AKIRU200/AKIRU-ICONS/main/ICONS/${item.icon}.png`;
    } else {
      const keyToFind = item?.itemID ? String(item.itemID) : "Not Provided";
      const value = cdn_img_json[item.itemID.toString()] ?? null;
      if (value) imgSrc = value;
    }
    image.src = imgSrc;
    if (item.description === "Didn't have an ID and description.") {
      image.style.background = "#607D8B";
    }
    image.addEventListener("click", () =>
      displayItemInfo(item, imgSrc, image, (isTrashMode = false)),
    );
    
    fragment.appendChild(image);
  }
  webpGallery.appendChild(fragment);
  let totalPages = Math.ceil(
    filteredItems.length / itemID.config.perPageLimitItem,
  );
  renderPagination(searchTerm, webps, (isTrashMode = false), totalPages); // Render pagination
  updateUrl();
}

async function renderPagination(searchTerm, webps, isTrashMode, totalPages) {
  const paginationNumbers = await generatePaginationNumbers(totalPages);
  const pagi73hd = document.getElementById("pagi73hd");
  if (paginationNumbers.length === 0) {
    pagi73hd.style.visibility = "hidden";
    if (!notFoundText()) {
      const notFoundText = document.createElement("h1");
      notFoundText.id = "not_found_text";
      notFoundText.className =
        "transition-all duration-100 ease-in-out mt-[10vh] font-black select-none ibm-plex-mono-regular text-zinc-500 rotate-90 text-[1000%] w-[100vw] text-center whitespace-nowrap";
      notFoundText.innerText = "NOT FOUND";
      document.getElementById("container").appendChild(notFoundText);
    }
  } else {
    pagi73hd.style.visibility = "visible";
    if (notFoundText()) {
      notFoundText().remove();
    }
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
    paginationNumbers.forEach((pageNumber) => {
      const pageButton = document.createElement("button");
      pageButton.className =
        "px-[8%] bg-[var(--secondary)] bounce-click select-none rounded-[11px] text-center ibm-plex-mono-regular font-medium uppercase text-[var(--primary)] disabled:pointer-events-none disabled:shadow-none";
      if (pageNumber === currentPage) {
        pageButton.classList.remove(
          "bg-[var(--secondary)]",
          "text-[var(--primary)]",
          "border",
          "border-2",
          "border-[var(--border-color)]",
        );
        pageButton.classList.add(
          "text-[var(--secondary)]",
          "bg-[var(--primary)]",
        );
      }
      pageButton.textContent = pageNumber;
      pageButton.addEventListener("click", async () => {
        await goToPage(pageNumber, searchTerm, webps, isTrashMode, totalPages);
      });
      pagination.appendChild(pageButton);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeInterfaceEdgeBtn();
  const inputField = document.getElementById("search-input");
  addEnterKeyListener(inputField, search);
});
