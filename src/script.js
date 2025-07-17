        let iconsData = [];
        let filteredData = [];
        let currentPage = 0;
        const itemsPerPage = 100;
        let uniqueFilters = {
            itemType: new Set(),
            collectionType: new Set(),
            Rare: new Set()
        };

        document.addEventListener("DOMContentLoaded", () => {
            setTimeout(() => {
                document.getElementById("loadingDot").style.display = "none";
                document.getElementById("header").style.display = "block";
                document.getElementById("container").style.display = "block";
            }, 1000);

            fetchIcons();
        });

        async function fetchIcons() {
            try {
                const response = await fetch("https://raw.githubusercontent.com/starexxx/FFItems/74c2af66d691776c2452bd72ca0388ba52d7c5fb/assets/itemData.json");
                const data = await response.json();

                iconsData = data.map(item => ({
                    itemId: item["itemID"],
                    name: item["description"],
                    iconName: item["icon"],
                    description: item["description"],
                    description2: item["description2"],
                    itemType: item["itemType"] ? item["itemType"].replace(/_/g, ' ') : '',
                    collectionType: item["collectionType"] ? item["collectionType"].replace(/_/g, ' ') : '',
                    Rare: item["Rare"],
                    imageUrl: `https://raw.githubusercontent.com/I-SHOW-AKIRU200/AKIRU-ICONS/main/ICONS/${item["itemID"]}.png`
                }));

                // Collect unique filter values
                iconsData.forEach(item => {
                    if (item.itemType) uniqueFilters.itemType.add(item.itemType);
                    if (item.collectionType) uniqueFilters.collectionType.add(item.collectionType);
                    if (item.Rare) uniqueFilters.Rare.add(item.Rare);
                });

                // Populate filter dropdowns
                populateDropdown("filter-Rare", uniqueFilters.Rare);
                populateDropdown("filter-itemType", uniqueFilters.itemType);
                populateDropdown("filter-collectionType", uniqueFilters.collectionType);

                filteredData = [...iconsData];
                renderIcons();
            } catch (error) {
                console.error("Failed to retrieve Icons:", error);
            }
        }

        function populateDropdown(id, values) {
            const select = document.getElementById(id);
            Array.from(values).sort().forEach(value => {
                if (!value) return;
                const option = document.createElement("option");
                option.value = value;
                option.textContent = value;
                select.appendChild(option);
            });
        }

        function applyFilters() {
            const itemTypeFilter = document.getElementById("filter-itemType").value;
            const collectionTypeFilter = document.getElementById("filter-collectionType").value;
            const rareFilter = document.getElementById("filter-Rare").value;
            
            filteredData = iconsData.filter(item => {
                return (!itemTypeFilter || item.itemType === itemTypeFilter) &&
                       (!collectionTypeFilter || item.collectionType === collectionTypeFilter) &&
                       (!rareFilter || item.Rare === rareFilter);
            });
            
            currentPage = 0;
            renderIcons();
        }

        function renderIcons() {
            const start = currentPage * itemsPerPage;
            const end = start + itemsPerPage;
            const visibleIcons = filteredData.slice(start, end);
            
            const grid = document.getElementById("iconGrid");
            grid.innerHTML = "";

            visibleIcons.forEach(icon => {
                const card = document.createElement("div");
                card.className = "icon-card";
                card.onclick = () => openModal(
                    icon.name,
                    icon.itemId,
                    icon.iconName,
                    icon.imageUrl,
                    icon.description,
                    icon.description2,
                    icon.itemType,
                    icon.collectionType,
                    icon.Rare
                );
                card.innerHTML = `
                    <img src="${icon.imageUrl}" 
                         onerror="this.src='assets/error-404.png'">
                `;
                grid.appendChild(card);
            });

            updatePagination();
        }

        function updatePagination() {
            const totalPages = Math.ceil(filteredData.length / itemsPerPage);
            const paginationDiv = document.getElementById("pagination");
            paginationDiv.innerHTML = "";

            for (let i = 0; i < totalPages; i++) {
                const button = document.createElement("button");
                button.textContent = i + 1;
                button.classList.toggle("active", i === currentPage);
                button.onclick = () => changePage(i);
                paginationDiv.appendChild(button);
            }
        }

        function changePage(page) {
            currentPage = page;
            renderIcons();
        }

        function filterIcons() {
            const query = document.getElementById("search").value.toLowerCase();
            filteredData = iconsData.filter(icon =>
                icon.name.toLowerCase().includes(query) ||
                icon.itemId.toString().includes(query) ||
                icon.iconName.toLowerCase().includes(query)
            );
            currentPage = 0;
            renderIcons();
        }

        function openModal(name, itemId, iconName, imageUrl, description, description2, itemType, collectionType, rare) {
            document.getElementById("modalDescription").textContent = description;
            document.getElementById("modalDescription2").textContent = description2 || "No additional description";
            document.getElementById("modalItemId").textContent = itemId;
            document.getElementById("modalIconName").textContent = iconName;
            document.getElementById("modalType").textContent = itemType || "Unknown";
            document.getElementById("modalCollectionType").textContent = collectionType || "Unknown";
            document.getElementById("modalRare").textContent = rare || "Unknown";
            document.getElementById("modalImage").src = imageUrl;
            
            const modal = document.getElementById("modal");
            modal.style.display = "flex";
            modal.style.animation = "fadeIn var(--transition-speed) ease";
            document.body.style.overflow = "hidden";
        }

        function closeModal() {
            const modal = document.getElementById("modal");
            modal.style.animation = "fadeOut var(--transition-speed) ease";
            
            setTimeout(() => {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
            }, 300);
        }

        document.addEventListener('click', function(event) {
            const modal = document.getElementById('modal');
            if (event.target === modal) {
                closeModal();
            }
        });

        document.getElementById("filter-Rare").addEventListener("change", applyFilters);
        document.getElementById("filter-itemType").addEventListener("change", applyFilters);
        document.getElementById("filter-collectionType").addEventListener("change", applyFilters);
