document.getElementById("generate").addEventListener("click", generateAndCrop);

const resetBtn = document.getElementById("reset");

resetBtn.addEventListener("click", () => {
  document.getElementById("before").innerHTML = "";
  document.getElementById("after").innerHTML = "";

  const fieldIds = [
    "frameWidth",
    "frameHeight",
    "picWidth",
    "picHeight",
    "picX",
    "picY",
  ];
  fieldIds.forEach((id) => {
    const input = document.getElementById(id);
    input.value = "";
  });

  resetBtn.style.display = "none";
});

function generateAndCrop() {
  const frameWidth = parseInt(document.getElementById("frameWidth").value);
  const frameHeight = parseInt(document.getElementById("frameHeight").value);
  const picWidth = parseInt(document.getElementById("picWidth").value);
  const picHeight = parseInt(document.getElementById("picHeight").value);
  const picX = parseInt(document.getElementById("picX").value);
  const picY = parseInt(document.getElementById("picY").value);

  const inputs = [
    { name: "Frame Width", value: frameWidth },
    { name: "Frame Height", value: frameHeight },
    { name: "Pic Width", value: picWidth },
    { name: "Pic Height", value: picHeight },
    { name: "Pic X", value: picX },
    { name: "Pic Y", value: picY },
  ];

  for (const input of inputs) {
    if (isNaN(input.value)) {
      alert(
        `The "${input.name}" field is either empty or contains a non-numeric value.`
      );
      return;
    }
    if (
      (input.name.includes("Width") || input.name.includes("Height")) &&
      input.value < 1
    ) {
      alert(`The "${input.name}" field must be greater than 0.`);
      return;
    }
    if ((input.name === "Pic X" || input.name === "Pic Y") && input.value < 0) {
      alert(`The "${input.name}" field cannot be negative.`);
      return;
    }
  }

  if (
    picX < 0 ||
    picY < 0 ||
    picWidth <= 0 ||
    picHeight <= 0 ||
    picX + picWidth > frameWidth ||
    picY + picHeight > frameHeight
  ) {
    alert("The data block cannot be larger than the main array.");
    return;
  }

  const totalSize = frameWidth * frameHeight;
  const frame = new Array(totalSize)
    .fill(0)
    .map(() => Math.floor(Math.random() * 100));

  renderGrid(
    "before",
    frame,
    frameWidth,
    frameHeight,
    picX,
    picY,
    picWidth,
    picHeight,
    "useful"
  );

  for (let y = 0; y < picHeight; y++) {
    for (let x = 0; x < picWidth; x++) {
      const srcIndex = (picY + y) * frameWidth + (picX + x);
      const destIndex = y * frameWidth + x;
      frame[destIndex] = frame[srcIndex];
    }
  }

  renderGrid(
    "after",
    frame,
    frameWidth,
    frameHeight,
    0,
    0,
    picWidth,
    picHeight,
    "copied"
  );

  resetBtn.style.display = "inline-block";
}

function renderGrid(
  containerId,
  array,
  width,
  height,
  markX,
  markY,
  markW,
  markH,
  className
) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  container.style.display = "grid";
  container.style.gridTemplateColumns = `repeat(${width}, 30px)`;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      const cell = document.createElement("div");
      cell.classList.add("cell");

      if (x >= markX && x < markX + markW && y >= markY && y < markY + markH) {
        cell.classList.add(className);
      }

      cell.textContent = array[index];
      container.appendChild(cell);
    }
  }
}
