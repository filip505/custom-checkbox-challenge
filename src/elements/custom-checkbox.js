class CustomCheckbox extends HTMLElement {
  static formAssociated = true;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._internals = this.attachInternals();
    this._checkbox = null;
    this.tabIndex = 0;
    this.addEventListener("click", this._toggleCheckbox.bind(this));
    this.addEventListener("keydown", this._handleKeydown.bind(this));
  }

  async connectedCallback() {
    const response = await fetch("src/elements/custom-checkbox.html");
    const html = await response.text();

    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;

    const template = wrapper.querySelector("#custom-checkbox-template");
    if (template) {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this._checkbox = this.shadowRoot.querySelector('input[type="checkbox"]');

      // Add a change listener to the internal checkbox for consistent updates
      this._checkbox.addEventListener("change", () => {
        this._updateFormValue();
        // Dispatch a custom change event from the host element for consistency
        this.dispatchEvent(
          new Event("change", {
            bubbles: true, // determines if an event will "bubble up" through the DOM tree.
            composed: true, // determines if an event can "compose" (i.e., cross) the boundary of a Shadow DOM.
          })
        );
      });

      // Initial synchronization of attributes and form value when connected to the DOM
      this._syncAttributes();
    }
  }

  // Define observed attributes to react to changes from the outside
  static get observedAttributes() {
    return ["checked", "name", "value"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Only re-sync if the attribute value actually changed
    if (oldValue !== newValue) {
      this._syncAttributes();
    }
  }

  // Synchronizes the host element's attributes with the internal checkbox and form value
  _syncAttributes() {
    if (this._checkbox) {
      this._checkbox.checked = this.hasAttribute("checked");
      this._checkbox.name = this.getAttribute("name") || "";
      this._checkbox.value = this.getAttribute("value") || "on";
      this._updateFormValue();
    }
  }

  // Update the form's value based on the internal checkbox's state
  _updateFormValue() {
    if (this._checkbox.checked) {
      this._internals.setFormValue(this._checkbox.value);
    } else {
      // When unchecked, a checkbox's value is not submitted, so set form value to null
      this._internals.setFormValue(null);
    }
  }

  // Toggles the internal checkbox state and triggers form value update
  _toggleCheckbox() {
    if (this._checkbox) {
      this._checkbox.checked = !this._checkbox.checked;
      // Manually dispatch change event on the internal checkbox to trigger _updateFormValue
      this._checkbox.dispatchEvent(new Event("change"));
    }
  }

  // Handles keyboard events for accessibility (e.g., Spacebar to toggle)
  _handleKeydown(event) {
    if (event.key === " " || event.key === "Spacebar") {
      // 'Spacebar' for older browsers
      event.preventDefault(); // Prevent default browser action (e.g., scrolling)
      this._toggleCheckbox(); // Toggle the checkbox
    }
  }

  // Expose standard form control properties for external interaction
  get checked() {
    return this._checkbox ? this._checkbox.checked : false;
  }

  set checked(value) {
    if (this._checkbox) {
      // Manipulate the 'checked' attribute, which will trigger attributeChangedCallback
      if (!!value) {
        this.setAttribute("checked", "");
      } else {
        this.removeAttribute("checked");
      }
    }
  }

  get value() {
    return this.getAttribute("value") || "on";
  }

  set value(val) {
    this.setAttribute("value", val);
  }

  get type() {
    return "checkbox";
  }

  get name() {
    return this.getAttribute("name");
  }

  set name(val) {
    this.setAttribute("name", val);
  }

  // Implement form-related methods (optional but good practice for robustness)
  formResetCallback() {
    // This is called when the form is reset; reset to initial 'checked' state
    this.checked = this.hasAttribute("checked");
  }

  formStateRestoreCallback(state, mode) {
    // This is called when the browser restores form state (e.g., after a back button)
    this.checked = state === this.value;
  }
}

customElements.define("custom-checkbox", CustomCheckbox);
