import type { FC } from 'react';
import type { RouterBlockerProviderProps } from './RouterBlockerProvider.types';
import type * as contextTypes from './RouterBlockerContext/RouterBlockerContext.types';

import React, { useState, useCallback } from 'react';
import { Modal, Wizard } from '@zero-tech/zui/components';
import { RouterBlockerContext } from './RouterBlockerContext';
import { INITIAL_DIALOG_CONFIG } from './RouterBlockerProvider.constants';
import styles from './RouterBlockerProvider.module.scss';

export const RouterBlockerProvider: FC<RouterBlockerProviderProps> = ({
	children
}) => {
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const [config, setConfig] = useState<contextTypes.RouterBlockerDialogConfig>(
		INITIAL_DIALOG_CONFIG
	);

	const handleDialogOpen: contextTypes.RouterBlockerContext['showDialog'] =
		useCallback(
			(config) => {
				setConfig(config);
				setIsDialogOpen(true);
			},
			[setConfig, setIsDialogOpen]
		);

	const handleDialogClose = useCallback(() => {
		config.cancelButtonConfig?.onClick?.();
		setIsDialogOpen(false);
	}, [config.cancelButtonConfig, setIsDialogOpen]);

	const handleDialogConfirm = useCallback(() => {
		config.confirmButtonConfig?.onClick?.();
		setIsDialogOpen(false);
	}, [config.confirmButtonConfig, setIsDialogOpen]);

	return (
		<RouterBlockerContext.Provider
			value={{
				showDialog: handleDialogOpen
			}}
		>
			<Modal
				open={isDialogOpen}
				onOpenChange={handleDialogClose}
				className={styles.Modal}
			>
				<Wizard.Container
					header={config.title}
					className={styles.WizardContainer}
				>
					<div className={styles.Message}>{config.message}</div>
					<Wizard.Buttons
						isPrimaryButtonActive
						isSecondaryButtonActive
						primaryButtonText={config.confirmButtonConfig?.text ?? 'Confirm'}
						secondaryButtonText={config.cancelButtonConfig?.text ?? 'Cancel'}
						onClickPrimaryButton={handleDialogConfirm}
						onClickSecondaryButton={handleDialogClose}
					/>
				</Wizard.Container>
			</Modal>
			{children}
		</RouterBlockerContext.Provider>
	);
};
