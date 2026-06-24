/*Types specific for NIMBUS */

import type { ReferencePoint, RPMStateScalarizationOptions, RPMStateSolverOptions, SolverResults, NIMBUSFinalizeResponse } from "$lib/gen/endpoints/DESDEOFastAPI";
import type { BaseMethodResponse, PeriodKey, Solution } from "$lib/types";

// Type for objective values in reference points and solutions
export type ObjectiveValues = {
    [key: string]: number;
};

// General response type that includes all possible fields
export type Response = BaseMethodResponse & {
	id?: number | null;
	preferences?: ReferencePoint;
	scalarization_options: RPMStateScalarizationOptions;
	solver: string | null;
	solver_options: RPMStateSolverOptions;
	solver_results?: SolverResults[];
} & {
	state_id: number | null;
	final_solution: Solution;
	saved_solutions: Solution[];
	all_solutions: Solution[];
};

export type { ReferencePoint };
export type FinishResponse = NIMBUSFinalizeResponse;

export interface MapState {
		mapOptions: Record<PeriodKey, Record<string, any>>;
		yearlist: string[];
		selectedPeriod: PeriodKey;
		geoJSON: object | undefined;
		mapName: string | undefined;
		mapDescription: string | undefined;
	}
