const NOVA_CONFIG = {
	contactEmail: "",
	socialLinks: {
		Instagram: "",
		Facebook: "",
		LinkedIn: "",
		X: ""
	}
};

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

menuToggle.addEventListener("click", () => {
	const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
	menuToggle.setAttribute("aria-expanded", String(!isOpen));
	menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
	siteNav.classList.toggle("is-open", !isOpen);
});

siteNav.addEventListener("click", (event) => {
	if (event.target.closest("a")) {
		menuToggle.setAttribute("aria-expanded", "false");
		menuToggle.setAttribute("aria-label", "Open navigation");
		siteNav.classList.remove("is-open");
	}
});

document.querySelectorAll("[data-service]").forEach((link) => {
	link.addEventListener("click", () => {
		const serviceSelect = document.querySelector('[name="service"]');
		const matchingOption = [...serviceSelect.options].find((option) => option.value === link.dataset.service || option.text === link.dataset.service);
		if (matchingOption) serviceSelect.value = matchingOption.value;
	});
});

const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
	button.addEventListener("click", () => {
		filterButtons.forEach((item) => {
			const active = item === button;
			item.classList.toggle("is-active", active);
			item.setAttribute("aria-pressed", String(active));
		});

		const selectedFilter = button.dataset.filter;
		projectCards.forEach((card) => {
			const categories = card.dataset.category.split(" ");
			card.hidden = selectedFilter !== "all" && !categories.includes(selectedFilter);
		});
	});
});

const projectDetails = {
	cafe: {
		title: "Roast & Crumb Café",
		kind: "CAFÉ WEBSITE",
		label: "Completed website project",
		description: "The Roast & Crumb Café website, presenting the café's coffee, fresh pastries, story, and visitor information.",
		goals: "Make the café's menu, story, and visit information easy to find while creating a welcoming first impression across desktop and mobile.",
		approach: "A welcoming café identity with clear navigation and a responsive layout for exploring the menu, story, and visit details."
	},
	beauty: {
		title: "LUMÉA SKIN",
		kind: "SKINCARE WEBSITE",
		label: "Completed website project",
		description: "The LUMÉA SKIN website, presenting thoughtfully crafted skincare products and simple everyday routines.",
		goals: "Present the product range clearly and give the brand a polished, recognizable visual language across its website and promotional material.",
		approach: "A calm, minimal visual identity and a responsive layout for exploring products, routines, and the brand story."
	},
	nova: {
		title: "Nova Digital Studio",
		kind: "WEBSITE DESIGN · BRAND IDENTITY",
		label: "Personal portfolio project",
		description: "The Nova Digital Studio website and identity direction: a business-focused home for services, creative concepts, and project inquiries.",
		goals: "Explain the studio's offer, build trust without invented claims, present sample work honestly, and make it simple to discuss a project.",
		approach: "A confident navy and electric-blue palette, responsive CSS-built mockups, clear service organization, and direct inquiry paths."
	},
	author: {
		title: "Tiana Book Promotion",
		kind: "BOOK PROMOTION WEBSITE",
		label: "Completed website project",
		description: "The Tiana Book Promotion website, showcasing book-promotion services, editorial features, and promotional media.",
		goals: "Present creative promotion services and help authors explore the book-focused editorial and media offerings.",
		approach: "A story-driven editorial layout featuring promotional artwork and clear paths to explore services and samples."
	}
};

const projectDialog = document.querySelector("#project-dialog");
const dialogArt = document.querySelector("#dialog-art");

document.querySelectorAll("[data-open-project]").forEach((button) => {
	button.addEventListener("click", () => {
		const projectId = button.dataset.openProject;
		const details = projectDetails[projectId];
		const sourceCard = document.querySelector(`[data-project="${projectId}"] .project-art`);
		if (!details || !sourceCard) return;

		dialogArt.replaceChildren(sourceCard.cloneNode(true));
		document.querySelector("#dialog-kind").textContent = details.kind;
		document.querySelector("#dialog-title").textContent = details.title;
		document.querySelector("#dialog-label").textContent = details.label;
		document.querySelector("#dialog-description").textContent = details.description;
		document.querySelector("#dialog-goals").textContent = details.goals;
		document.querySelector("#dialog-approach").textContent = details.approach;
		projectDialog.showModal();
	});
});

document.querySelector("#dialog-contact").addEventListener("click", () => projectDialog.close());


const inquiryForm = document.querySelector("#inquiry-form");
const formStatus = document.querySelector("#form-status");

inquiryForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    formStatus.dataset.state = "";
    formStatus.textContent = "Sending your inquiry...";

    if (!inquiryForm.checkValidity()) {
        formStatus.textContent = "Please complete the required fields and enter a valid email address.";
        formStatus.dataset.state = "error";
        inquiryForm.reportValidity();
        return;
    }

    const submitButton = inquiryForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    try {
        const response = await fetch("https://formspree.io/f/xoeddqay", {
            method: "POST",
            body: new FormData(inquiryForm),
            headers: {
                Accept: "application/json"
            }
        });

        if (response.ok) {
            formStatus.textContent = "Thank you! Your project inquiry has been sent successfully. We'll get back to you soon.";
            formStatus.dataset.state = "success";
            inquiryForm.reset();
        } else {
            formStatus.textContent = "Sorry, your inquiry could not be sent. Please try again.";
            formStatus.dataset.state = "error";
        }
    } catch (error) {
        formStatus.textContent = "Unable to send your inquiry. Please check your internet connection and try again.";
        formStatus.dataset.state = "error";
    } finally {
        submitButton.disabled = false;
    }
});


const contactEmail = document.querySelector("#contact-email");
const footerEmail = document.querySelector("#footer-email");

if (NOVA_CONFIG.contactEmail) {
	contactEmail.innerHTML = `Email <a href="mailto:${encodeURIComponent(NOVA_CONFIG.contactEmail)}">${NOVA_CONFIG.contactEmail}</a>`;
	footerEmail.innerHTML = `<a href="mailto:${encodeURIComponent(NOVA_CONFIG.contactEmail)}">${NOVA_CONFIG.contactEmail}</a>`;
} else {
	contactEmail.textContent = "Contact email is not configured yet.";
	footerEmail.textContent = "Contact email is not configured yet.";
}

const socialLinks = document.querySelector("#social-links");
Object.entries(NOVA_CONFIG.socialLinks).forEach(([name, url]) => {
	if (!url) return;
	try {
		const parsedUrl = new URL(url);
		if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") return;
		const link = document.createElement("a");
		link.href = parsedUrl.href;
		link.target = "_blank";
		link.rel = "noopener noreferrer";
		link.textContent = name;
		socialLinks.append(link);
	} catch {
		// Ignore unconfigured or invalid profile URLs.
	}
});

document.querySelector("#year").textContent = new Date().getFullYear();

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
	const revealObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) return;
			entry.target.classList.add("is-visible");
			observer.unobserve(entry.target);
		});
	}, { threshold: 0.12 });
	revealElements.forEach((element) => revealObserver.observe(element));
} else {
	revealElements.forEach((element) => element.classList.add("is-visible"));
}
