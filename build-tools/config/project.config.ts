import { DEFAULT_PROJECT_CONFIG } from '../util/default-project-config';

export const PROJECT_CONFIG = DEFAULT_PROJECT_CONFIG.merge({
    staticFiles: [
        (path: string) => `${path}/README.md`
    ]
});
