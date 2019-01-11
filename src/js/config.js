import $ from "jquery";

export default function makeConfig(config) {
  $(() => {
    let layers = config.length;
    let configSource = [];

    $("#numLayers").val(layers);
    $("#setNumLayers").click(() => {
      layers = $("#numLayers").val();
      configSource = [];
      drawConfigFields(config, layers, configSource);
    });
    $("#setConfig").click(() => {
      //Clear Config
      config.splice(0);

      configSource.forEach(element => {
        config.push({
          units: parseInt($(element.units).val()),
          activation: $(element.activation).val(),
          kernelInitializer: "randomUniform"
        });
      });

      console.log(config);
    });

    drawConfigFields(config, layers, configSource);
  });
}

function drawConfigFields(config, layers, configSource) {
  let i = 0;
  const layersCont = $(".layers").get(0);
  $(layersCont)
    .children()
    .each((index, element) => {
      layersCont.removeChild(element);
    });
  config.forEach(element => {
    i++;
    layersCont.appendChild(makeLayerDiv(element));
  });

  for (null; i < layers; i++) {
    layersCont.appendChild(makeLayerDiv());
  }

  function appendOptions(name, sel) {
    const option = document.createElement("option");
    option.appendChild(document.createTextNode(name));
    sel.appendChild(option);
  }

  function makeLayerDiv(configEl = undefined) {
    const layer = document.createElement("div");
    $(layer).addClass("element");
    const unitsInput = $(document.createElement("input")).attr(
      "type",
      () => "number"
    )[0];
    layer.appendChild(unitsInput);

    const selector = document.createElement("select");
    appendOptions("elu", selector);
    appendOptions("hardSigmoid", selector);
    appendOptions("linear", selector);
    appendOptions("relu", selector);
    appendOptions("relu6", selector);
    appendOptions("selu", selector);
    appendOptions("sigmoid", selector);
    appendOptions("softmax", selector);
    appendOptions("softplus", selector);
    appendOptions("softsign", selector);
    appendOptions("tanh", selector);
    layer.appendChild(selector);

    //add to source
    configSource.push({
      units: unitsInput,
      activation: selector
    });

    if (configEl) {
      $(unitsInput).val(configEl.units);
      $(selector).val(configEl.activation);
    }

    //Append
    return layer;
  }
}
