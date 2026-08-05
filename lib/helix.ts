/**
 * Geometria da hélice de DNA.
 *
 * A hélice é o fio condutor do site: mesma função gera a versão grande do hero,
 * o trilho que atravessa a home e a hélice fina da página de produto.
 *
 * Truque de movimento: uma hélice transladada no próprio eixo é visualmente
 * idêntica a uma hélice girando. Por isso desenhamos um traçado mais alto que a
 * área visível e animamos só o transform — sem recalcular path a cada frame.
 */

export type HelixRung = {
  y: number;
  x1: number;
  x2: number;
  /** 0 = fita traseira ao fundo, 1 = fitas cruzando na frente */
  depth: number;
};

export type HelixGeometry = {
  width: number;
  height: number;
  /** altura de um ciclo completo — quanto transladar para o loop ser contínuo */
  period: number;
  front: string;
  back: string;
  rungs: HelixRung[];
};

type HelixOptions = {
  /** largura total do desenho (px no espaço do viewBox) */
  width: number;
  /** altura total desenhada — normalmente 2–3× a área visível */
  height: number;
  /** número de voltas completas ao longo de `height` */
  turns: number;
  /** pares de base por volta */
  rungsPerTurn?: number;
  /** amostras por volta ao rasterizar a senoide */
  samplesPerTurn?: number;
  /** deslocamento inicial de fase, em radianos */
  phase?: number;
};

function strand(
  { width, height, turns, samplesPerTurn = 28, phase = 0 }: HelixOptions,
  offset: number,
): string {
  const amplitude = width / 2 - 1;
  const center = width / 2;
  const samples = Math.max(2, Math.round(turns * samplesPerTurn));
  const points: string[] = [];

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const angle = t * turns * Math.PI * 2 + phase + offset;
    const x = center + Math.sin(angle) * amplitude;
    const y = t * height;
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }

  return `M${points.join(" L")}`;
}

export function helixGeometry(options: HelixOptions): HelixGeometry {
  const { width, height, turns, rungsPerTurn = 8, phase = 0 } = options;
  const amplitude = width / 2 - 1;
  const center = width / 2;
  const total = Math.round(turns * rungsPerTurn);
  const rungs: HelixRung[] = [];

  for (let i = 0; i <= total; i++) {
    const t = i / total;
    const angle = t * turns * Math.PI * 2 + phase;
    const x1 = center + Math.sin(angle) * amplitude;
    const x2 = center + Math.sin(angle + Math.PI) * amplitude;
    rungs.push({
      y: t * height,
      x1,
      x2,
      // fitas mais abertas = ponto de vista lateral = par de base mais visível
      depth: Math.abs(Math.sin(angle)),
    });
  }

  return {
    width,
    height,
    period: height / turns,
    front: strand(options, 0),
    back: strand(options, Math.PI),
    rungs,
  };
}
