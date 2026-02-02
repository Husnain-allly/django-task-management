document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("confirmModal");
  const confirmMessage = document.getElementById("confirmMessage");
  const confirmForm = document.getElementById("confirmForm");
  const cancelBtn = document.getElementById("cancelBtn");

  function openModal(message, actionUrl) {
    confirmMessage.textContent = message;
    confirmForm.action = actionUrl;
    modal.style.display = "block";
  }

  function closeModal() {
    modal.style.display = "none";
    confirmForm.action = "";
  }

  document.querySelectorAll(".delete-link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const url = link.dataset.deleteUrl;
      const title = link.dataset.taskTitle;

      openModal(`Are you sure you want to delete: ${title}?`, url);
    });
  });

  cancelBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
});
