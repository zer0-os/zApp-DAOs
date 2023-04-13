import styles from './Body.module.scss';
import { MarkdownViewer, Skeleton } from '@zero-tech/zui/components';
import { formatProposalBody } from '../../../../features/view-dao-proposals/DaoProposalsTable/lib';
import React from 'react';

export interface BodyProps {
	bodyMarkdown?: string;
}

export const Body = ({ bodyMarkdown }: BodyProps) => {
	return (
		<div className={styles.Body}>
			{bodyMarkdown ? (
				<MarkdownViewer
					className={styles.Markdown}
					text={formatProposalBody(bodyMarkdown)}
				/>
			) : (
				<Skeleton count={8} />
			)}
		</div>
	);
};
