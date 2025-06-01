import "./elements/index.js";

// For debuggin purpuse
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("myForm");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      console.log("Form Data (Submitted values):");
      for (let [key, value] of formData.entries()) {
        console.log(`  Name: "${key}", Value: "${value}"`);
      }

      console.log("Form Elements (form.elements collection):");
      for (let i = 0; i < form.elements.length; i++) {
        const element = form.elements[i];
        if (element.name) {
          console.log(
            `  Element Name: "${element.name}", Type: "${element.type}", Value: "${element.value}", Checked: ${element.checked}`
          );
        }
      }
    });
  }
});
