package net.mackenzie.testcast;

import android.content.res.Configuration;
import android.os.Bundle;
import android.view.Menu;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import net.mackenzie.chromeinteractor.ChromecastInteractor;

/**
 * Main activity of the application
 */
public class MainActivity extends AppCompatActivity {
    private ChromecastInteractor chromecastInteractor;
    private TestControllerView testControllerView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        TestController testController = new TestController();
        testControllerView = new TestControllerView(this, getString(R.string.app_id), testController);
        chromecastInteractor = new ChromecastInteractor(this, getString(R.string.app_id), getString(R.string.namespace),
                testController);
    }

    @Override
    protected void onPause() {
        chromecastInteractor.pause();
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        chromecastInteractor.resume();
    }

    @Override
    public void onDestroy() {
        chromecastInteractor.disconnect();
        super.onDestroy();
    }

    @Override
    public void onConfigurationChanged(@NonNull Configuration newConfig) {
    }

    /**
     * Add the MediaRoute ("Chromecast") button to the ActionBar at the top of the app
     *
     * @param menu - menu to add the menu items to
     * @return true if added an item
     */
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        super.onCreateOptionsMenu(menu);
        getMenuInflater().inflate(R.menu.main, menu);
        testControllerView.setMediaRouteSelector(menu);
        return true;
    }
}