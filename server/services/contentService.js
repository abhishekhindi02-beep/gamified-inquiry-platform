export class ContentService {
  constructor() {
    this.articles = [
      {
        id: 'quantum-biology-photosynthesis',
        title: 'Quantum Coherence in Photosynthetic Light Harvesting',
        discipline: 'Quantum Biology',
        summary: 'Investigating how marine algae and plant chlorophyll complexes achieve near-unity quantum efficiency during solar energy conversion.',
        content: `
Photosynthesis relies on pigment-protein complexes to absorb light and transfer excitation energy to reaction centers with near 100% quantum efficiency. Classical hopping models of energy transfer fail to explain why energy isn't dissipated as heat during random walks through complex protein structures.

Spectroscopic observations suggest quantum coherence allows excitons to sample multiple pathways simultaneously—a phenomenon known as quantum superposition in biological environments.

However, biological systems operate at warm, noisy, non-equilibrium conditions. The exact role of chromophore-protein vibrations (vibronic coupling) in sustaining coherence against thermal decoherence remains a central debate in quantum biophysics.
        `.trim(),
        formulas: [
          {
            id: 'f_exciton_hamiltonian',
            label: 'System-Bath Vibronic Hamiltonian',
            latex: 'H = \\sum_{i} \\epsilon_i |i\\rangle\\langle i| + \\sum_{i\\neq j} J_{ij} |i\\rangle\\langle j| + H_{bath} + H_{sys-bath}',
            explanation: 'Describes chromophore site energies, inter-site coupling J_ij, and coupling to noisy thermal protein bath modes.'
          },
          {
            id: 'f_coherence_rate',
            label: 'FRET Energy Transfer Rate',
            latex: 'k_{ET} = \\frac{2\\pi}{\\hbar} |V_{DA}|^2 \\int f_D(\\nu) a_A(\\nu) d\\nu',
            explanation: 'Förster Resonance Energy Transfer rate linking donor emission and acceptor absorption spectral overlap.'
          }
        ],
        diagrams: [
          {
            id: 'd_chlorophyll_spectrum',
            title: 'Chlorophyll Absorption & Coherence Pathways',
            type: 'spectrum_diagram',
            caption: 'Absorption peaks at 430nm (Soret band) & 660nm (Qy band) with quantum coherence pathways.',
            svgData: 'chlorophyll_coherence_map'
          },
          {
            id: 'd_energy_funnel',
            title: 'Exciton Energy Transfer Funnel',
            type: 'energy_map',
            caption: 'Delocalized exciton state funneling into P680 reaction center.',
            svgData: 'energy_funnel_map'
          }
        ]
      },
      {
        id: 'enzyme-quantum-tunneling',
        title: 'Enzymatic Catalysis & Hydrogen Quantum Tunneling',
        discipline: 'Biochemistry',
        summary: 'Exploring how enzymes utilize quantum mechanical barrier tunneling of protons and hydride ions to accelerate biochemical reaction rates.',
        content: `
Enzymatic reaction rates can exceed uncatalyzed rates by factors of up to 10^17. While classical Transition State Theory attributes rate acceleration to activation energy reduction via active site complementary binding, heavy-atom kinetic isotope effects (KIE) reveal quantum tunneling of light particles.

In enzymes like soybean lipoxygenase and alcohol dehydrogenase, primary deuterium and tritium isotope effects deviate dramatically from classical Arrhenius temperature dependence.

Vibrational motions of the enzyme scaffold ("promoting vibrations") compress donor-acceptor distances (DAD) to transiently shorten tunneling barriers. Whether enzymes evolved specifically to optimize tunneling or if tunneling is an inherent consequence of packed active site geometries is actively investigated.
        `.trim(),
        formulas: [
          {
            id: 'f_tunneling_prob',
            label: 'WKB Barrier Tunneling Probability',
            latex: 'P_{tunnel} \\approx \\exp\\left( -\\frac{2}{\\hbar} \\int_{x_1}^{x_2} \\sqrt{2m(V(x) - E)} \\, dx \\right)',
            explanation: 'WKB approximation for tunneling probability, showing mass dependence m and barrier width x2 - x1.'
          },
          {
            id: 'f_kie_ratio',
            label: 'Kinetic Isotope Effect (KIE)',
            latex: 'KIE = \\frac{k_H}{k_D} = \\frac{A_H}{A_D} \\exp\\left( \\frac{\\Delta E_{ZPE}}{k_B T} \\right)',
            explanation: 'Ratio of reaction rates for hydrogen vs deuterium, highlighting Zero Point Energy difference Delta E_ZPE.'
          }
        ],
        diagrams: [
          {
            id: 'd_tunneling_barrier',
            title: 'Active Site Distance Compression & Tunneling Barrier',
            type: 'tunneling_diagram',
            caption: 'Transient Donor-Acceptor Distance (DAD) reduction during enzyme active site vibration.',
            svgData: 'tunneling_barrier_map'
          }
        ]
      },
      {
        id: 'prebiotic-parity-violation',
        title: 'Cosmic Electroweak Parity Violation & Homochirality',
        discipline: 'Astrophysics & Prebiotic Chemistry',
        summary: 'Investigating whether cosmic electroweak parity violation broke chiral symmetry in primordial biological molecules.',
        content: `
Terrestrial biology exhibits strict homochirality: all natural proteins consist exclusively of L-amino acids, while RNA and DNA backbones utilize D-sugars. Physical law under electromagnetic and gravitational interactions is mirror-symmetric, suggesting racemic mixtures (50:50 L/D) should form naturally.

However, the weak nuclear force violates parity symmetry (P-violation), imparting a tiny Energy Parity Violating Difference (EPVD) between enantiomers on the order of 10^-17 to 10^-14 eV.

Whether this infinitesimal energy difference was amplified by autocatalytic non-equilibrium chemical reactions (e.g., Soai reaction kinetics) or if homochirality arose from circularly polarized interstellar radiation in protostellar nebulae remains a fundamental open question in astrobiology.
        `.trim(),
        formulas: [
          {
            id: 'f_epvd_weak',
            label: 'Electroweak Parity Violating Potential',
            latex: 'V_{EPVD} = \\frac{G_F}{2\\sqrt{2} m_e c} \\sum_i Q_W \\left\\{ \\vec{\\sigma}_i \\cdot \\vec{p}_i , \\delta^3(\\vec{r}_i) \\right\\}',
            explanation: 'Electroweak weak neutral current potential coupling electron spin and momentum near atomic nuclei.'
          }
        ],
        diagrams: [
          {
            id: 'd_homochirality_amplification',
            title: 'Symmetry Breaking & Autocatalytic Amplification',
            type: 'chiral_diagram',
            caption: 'Bifurcation diagram showing tiny initial EPVD bias amplified into single-enantiomer dominance.',
            svgData: 'chiral_amplification_map'
          }
        ]
      }
    ];
  }

  getArticles() {
    return this.articles.map(a => ({
      id: a.id,
      title: a.title,
      discipline: a.discipline,
      summary: a.summary,
      formulaCount: a.formulas.length,
      diagramCount: a.diagrams.length
    }));
  }

  getArticleById(id) {
    return this.articles.find(a => a.id === id) || this.articles[0];
  }
}

export const contentService = new ContentService();
