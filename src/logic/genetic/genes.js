const neuralFlattenIterator = (fn, neural) => {
  const {layers} = neural;

  for (let i = 0; i < layers.length; ++i) {
    const {weightsMatrix} = layers[i];
    if (!weightsMatrix)
      continue;

    for (let j = 0; j < weightsMatrix.length; ++j) {
      const matrixRow = weightsMatrix[j];

      for (let k = 0; k < matrixRow.length; ++k) {
        const index = (
          (i * weightsMatrix.length * matrixRow.length)
            + (j * matrixRow.length)
            + k
        );

        fn(matrixRow, k, index);
      }
    }
  }

  return neural;
};

export const getNeuralWeightsGenes = (neural) => {
  const genes = [];

  neuralFlattenIterator(
    (matrixRow, k, index) => {
      genes[index] = matrixRow[k];
    },
    neural,
  );

  return genes;
};

export const loadGenesToMatrix = (genes, neural) => neuralFlattenIterator(
  (matrixRow, k, index) => {
    matrixRow[k] = genes[index];
  },
  neural,
);
