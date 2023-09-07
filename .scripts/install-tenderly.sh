if ! command -v tenderly &> /dev/null
then
    # if on macos
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "Installing tenderly-cli for MacOS..."
        curl https://raw.githubusercontent.com/Tenderly/tenderly-cli/master/scripts/install-macos.sh | sh
    # if on linux
    elif [[ "$OSTYPE" == "linux"* ]]; then
        echo "Installing tenderly-cli for Linux..."
        curl https://raw.githubusercontent.com/Tenderly/tenderly-cli/master/scripts/install-linux.sh | sh
    fi 

    if ! command -v tenderly &> /dev/null 
    then
        echo "✗ Could not install tenderly-cli."
        exit 1
    fi
    
    echo "✓ tenderly-cli installed."
else
    echo "✓ tenderly-cli already installed."
fi