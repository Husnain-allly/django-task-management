document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("confirmModal");
  const msg = document.getElementById("confirmMessage");
  const form = document.getElementById("confirmForm");
  const cancel = document.getElementById("cancelBtn");
  const confirmBtn = document.getElementById("confirmBtn");

  function openModal({ actionUrl, message, confirmText }) {
    msg.textContent = message || "Are you sure?";
    form.action = actionUrl || "";
    confirmBtn.textContent = confirmText || "Confirm";
    modal.style.display = "block";
  }

  function closeModal() {
    modal.style.display = "none";
    form.action = "";
  }

  document.querySelectorAll(".js-confirm").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openModal({
        actionUrl: el.dataset.actionUrl,
        message: el.dataset.message,
        confirmText: el.dataset.confirmText,
      });
    });
  });

  cancel.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
});
