import React, {Component, PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styles from './DialectSelector.css';
import classnames from 'classnames';
import {DIALECTS} from '../../../constants/constants';

/*
    Displays interactive database dialect logos and alters
    the chosen `configuration` dialect parameter.
*/

const LOGOS = {
    POSTGRES: './images/postgresLogo.png',
    MYSQL: './images/mysqlLogo.png',
    MARIADB: './images/mariadbLogo.png',
    MSSQL: './images/mssqlLogo.png',
    SQLITE: './images/sqliteLogo.png'
};

export default class DialectSelector extends Component {
    constructor(props) {
        super(props);
        this.resetAll = this.resetAll.bind(this);
        this.testClass = this.testClass.bind(this);
        this.logoIsSelected = this.logoIsSelected.bind(this);
        this.state = {
            selectedDialect: props.configuration.get('dialect')
        };
    }

    testClass(dialect) {
        /*
            Sanity check, to see if the dialect selected by user is consistent
            with the configuration store.
        */

        const consistency =
            (DIALECTS[dialect]
            === this.state.selectedEngine) &&
            (DIALECTS[dialect]
            === this.props.configuration.get('dialect'));

        if (consistency) {
            return 'test-consistent_state';
        } else {
            return 'test-nonconsistent_state';
        }
    }

    logoIsSelected(dialect) {
        return this.state.selectedEngine === DIALECTS[dialect];
    }

    resetAll() {
        this.props.configActions.merge({
            username: '',
            password: '',
            database: '',
            port: '',
            storage: '',
            host: ''
        });
    }

	render() {
        const {configActions} = this.props;

		const logos = Object.keys(DIALECTS).map(dialect => (
            <div>
                <div className={classnames(
                        styles.logo,
                        {[styles.logoSelected]: this.logoIsSelected(dialect)},
                        [this.testClass(dialect)]
                    )}
                    onClick={() => {
                        this.setState({selectedEngine: DIALECTS[dialect]});
                        configActions.update({dialect: DIALECTS[dialect]});
                        this.resetAll();
                    }}
                    id={`test-logo-${DIALECTS[dialect]}`}
                >
                    <img
                        className={styles.logoImage}
                        src={DIALECTS[dialect]}
                    />
                </div>
            </div>
        ));

		return (
			<div>{logos}</div>
		);
	}
}

DialectSelector.propTypes = {
    configuration: ImmutablePropTypes.map.isRequired,
    configActions: PropTypes.Object
};
