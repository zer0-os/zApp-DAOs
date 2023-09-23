import {
	Modal as ZuiModal,
	ModalProps as ZuiModalProps,
} from '@zero-tech/zui/components/Modal';

import classNames from 'classnames';
import styles from './Modal.module.scss';
import { IconButton } from '@zero-tech/zui/components';
import { IconXClose } from '@zero-tech/zui/icons';

export const Modal = ({
	className,
	children,
	onOpenChange,
	...props
}: ZuiModalProps) => {
	return (
		<ZuiModal
			className={classNames(styles.Modal, className)}
			onOpenChange={onOpenChange}
			{...props}
		>
			<IconButton
				className={styles.Close}
				Icon={IconXClose}
				onClick={() => onOpenChange?.(false)}
			/>
			{children}
		</ZuiModal>
	);
};
