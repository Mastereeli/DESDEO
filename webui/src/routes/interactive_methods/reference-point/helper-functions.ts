/**
 * NIMBUS Helper Functions
 *
 * This file contains utility functions for the UI of NIMBUS interactive multiobjective optimization method.
 * These functions handle common operations like data transformation, validation, API calls, and
 * visualization data preparation.
 *
 * @author Stina <palomakistina@gmail.com>
 * @created August 2025
 */

import type {
	ProblemInfo,
	SolutionReferenceResponse,
	RPMState,
} from '$lib/gen/endpoints/DESDEOFastAPI';

// Type definitions for NIMBUS components
type Solution = SolutionReferenceResponse;
type Response = RPMState;

/**
 * Checks if a problem has utopia metadata for map visualization
 * @param prob The problem to check
 * @returns boolean indicating if the problem has utopia metadata
 */
export function checkUtopiaMetadata(prob: ProblemInfo | null) {
	// Check if the problem and its metadata exist
	if (!prob || !prob.problem_metadata) {
		return false;
	}

	// Check if forest_metadata exists and is not empty
	return (
		prob.problem_metadata.forest_metadata !== null &&
		Array.isArray(prob.problem_metadata.forest_metadata) &&
		prob.problem_metadata.forest_metadata.length > 0
	);
}

/**
 * Maps solutions objective values to arrays suitable for visualization components
 * @param solutions Array of solutions with objective values
 * @param problem The problem containing objective definitions
 * @returns Array of arrays with objective values in the order defined by the problem
 */
export function mapSolutionsToObjectiveValues(solutions: Solution[], problem: ProblemInfo) {
	return solutions.map((result) => {
		return problem.objectives.map((obj) => {
			const value = result.objective_values && result.objective_values[obj.symbol];
			return Array.isArray(value) ? value[0] : value;
		});
	});
}

/**
 * Initialize preferences from previous state or ideal values
 * @param state The current NIMBUS response state
 * @param problem The current problem
 * @returns Array of preference values
 */
export function updatePreferencesFromState(
	state: Response | null,
	problem: ProblemInfo | null
): number[] {
	if (!problem) return [];

	// Try to get previous preference from NIMBUS state
	if (state && 'preferences' in state && state.preferences) {
		// Extract aspiration levels from previous preference
		const previous_pref = state.preferences as {
			aspiration_levels?: Record<string, number>;
		};
		if (previous_pref.aspiration_levels) {
			return problem.objectives.map(
				(obj) => previous_pref.aspiration_levels![obj.symbol] ?? obj.ideal ?? 0
			);
		}
	}

	// Fallback to ideal values
	return problem.objectives.map((obj) => obj.ideal ?? 0);
}

/**
 * Converts objective values in object format to array format
 * Used to transform previous objectives for visualization components
 *
 * @param objectiveObj The objective values in object format keyed by symbol
 * @param problem The problem containing objective definitions
 * @returns Array of values in the order defined by the problem objectives
 */
export function convertObjectiveToArray(
	objectiveObj: Record<string, number> | undefined | null,
	problem: ProblemInfo | null
): number[] {
	if (!problem || !objectiveObj) {
		return [];
	}

	return problem.objectives.map((obj) => {
		const value = objectiveObj[obj.symbol];
		return value !== undefined && value !== null ? (Array.isArray(value) ? value[0] : value) : 0;
	});
}

/**
 * Updates solution names from saved solutions
 *
 * @param savedSolutions - Array of saved solutions with names
 * @param targetSolutions - Array of solutions to update with names
 * @returns The updated target solutions array
 */
export function updateSolutionNames(
	savedSolutions: Solution[],
	targetSolutions: Solution[]
): Solution[] {
	if (!savedSolutions || !targetSolutions) {
		return targetSolutions;
	}

	// Create a copy of the target solutions to avoid mutating the original
	const updatedSolutions = [...targetSolutions];

	// Update names for solutions that exist in saved solutions
	for (let solution of updatedSolutions) {
		const savedIndex = savedSolutions.findIndex(
			(saved) =>
				saved.state_id === solution.state_id && saved.solution_index === solution.solution_index
		);

		if (savedIndex !== -1) {
			// Solution exists in saved_solutions, update the name
			solution.name = savedSolutions[savedIndex].name;
		}
	}

	return updatedSolutions;
}
